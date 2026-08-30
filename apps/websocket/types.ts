export type ServerToClientMessage =
  | { type: "active-users"; boardId: string; count: number }
  | { type: "board-updated"; boardId: string; reason: "issue-created" | "issue-updated" | "issue-deleted" };

export type NotifyPayload = {
  boardId: string;
  reason: "issue-created" | "issue-updated" | "issue-deleted";
};

