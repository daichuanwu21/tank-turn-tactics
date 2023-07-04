import GameBoard from "./components/game-board/GameBoard";
import FloatingUserMenu from "./components/auth/FloatingUserMenu";
import { Notifications } from "@mantine/notifications";

const App: React.FC = () => {
  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GameBoard />
      <Notifications />
      <FloatingUserMenu />
    </div>
  );
};

export default App;
