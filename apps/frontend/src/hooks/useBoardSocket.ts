import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:4001";

type BoardUpdateReason = "issue-created" | "issue-updated" | "issue-deleted";

type ServerMessage =
  | { type: "active-users"; boardId: string; count: number }
  | { type: "board-updated"; boardId: string; reason: BoardUpdateReason };

export function useBoardSocket(boardId: string | undefined, onBoardUpdate?: (reason: BoardUpdateReason) => void) {
  const [activeUsers, setActiveUsers] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!boardId) return;

    const socket = new WebSocket(`${WS_URL}?boardId=${encodeURIComponent(boardId)}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data.type === "active-users") {
        setActiveUsers(data.count);
      }

      if (data.type === "board-updated") {
        onBoardUpdate?.(data.reason);
      }
    };

    return () => {
      socket.close();
    };
  }, [boardId]);

  return { activeUsers };
}