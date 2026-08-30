import type { WebSocket } from "ws";
import type { ServerToClientMessage } from "./types";

// boardId -> Map<connectionId, WebSocket>
const boards = new Map<string, Map<string, WebSocket>>();

export function addConnection(boardId: string, connectionId: string, socket: WebSocket) {
  if (!boards.has(boardId)) {
    boards.set(boardId, new Map());
  }
  boards.get(boardId)!.set(connectionId, socket);
}

export function removeConnection(boardId: string, connectionId: string) {
  const board = boards.get(boardId);
  if (!board) return;

  board.delete(connectionId);
  if (board.size === 0) {
    boards.delete(boardId);
  }
}

export function getActiveCount(boardId: string): number {
  return boards.get(boardId)?.size ?? 0;
}

export function broadcastToBoard(boardId: string, message: ServerToClientMessage) {
  const board = boards.get(boardId);
  if (!board) return;

  const payload = JSON.stringify(message);
  for (const socket of board.values()) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }
}

export function broadcastActiveUsers(boardId: string) {
  broadcastToBoard(boardId, {
    type: "active-users",
    boardId,
    count: getActiveCount(boardId),
  });
}