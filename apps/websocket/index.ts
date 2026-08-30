import { createServer, IncomingMessage } from "http";
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";
import {
  addConnection,
  removeConnection,
  broadcastActiveUsers,
  broadcastToBoard,
} from "./boardRegistry.ts";
import type { NotifyPayload } from "./types.ts";


const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 4001;

// Single HTTP server handles both:
// 1. WebSocket upgrades (for frontend clients)
// 2. POST /notify (internal call from apps/backend after a DB mutation)
const server = createServer((req, res) => {
  if (req.method === "POST" && req.url === "/notify") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload: NotifyPayload = JSON.parse(body);
        broadcastToBoard(payload.boardId, {
          type: "board-updated",
          boardId: payload.boardId,
          reason: payload.reason,
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Invalid payload" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req: IncomingMessage) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const boardId = url.searchParams.get("boardId");

  if (!boardId) {
    socket.close(4000, "boardId is required");
    return;
  }

  const connectionId = randomUUID();
  addConnection(boardId, connectionId, socket);
  broadcastActiveUsers(boardId);

  socket.on("close", () => {
    removeConnection(boardId, connectionId);
    broadcastActiveUsers(boardId);
  });

  socket.on("error", () => {
    removeConnection(boardId, connectionId);
    broadcastActiveUsers(boardId);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});