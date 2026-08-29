import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./pages/board.tsx";
import Users from "./pages/users.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board" element={<Board />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}