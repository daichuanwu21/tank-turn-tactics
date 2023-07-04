import GameBoard from "./components/game-board/GameBoard";
import FloatingUserMenu from "./components/auth/FloatingUserMenu";

const App: React.FC = () => {
  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GameBoard />

      <FloatingUserMenu />
    </div>
  );
};

export default App;
