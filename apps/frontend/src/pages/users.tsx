import { useCallback, useState } from "react";
import { useBoardSocket } from "../hooks/useBoardSocket";

export function Users() {
  const [refreshTick, setRefreshTick] = useState(0);

  const handleBoardUpdate = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  const { activeUsers } = useBoardSocket("demo-board", handleBoardUpdate);

  return (
    <div>
      <span>🟢 {activeUsers} active</span>
    </div>
  );
}

export default Users;