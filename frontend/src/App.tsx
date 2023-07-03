import GameBoard from "./components/game-board/GameBoard";

const App: React.FC = () => {
  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GameBoard />
    </div>
  );
};

export default App;
