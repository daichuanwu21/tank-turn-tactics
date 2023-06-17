import GameBoard from "./components/game-board/GameBoard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addTank,
  initialSync,
  updateTank,
  removeTank,
} from "./redux/tanksSlice";

function App() {
  // NOTE: these are tests for the redux store
  const dispatch = useDispatch();
  useEffect(() => {
    const TANKS = [
      "bd8fa00c-5fc5-44ad-82d9-c338d29dc98b",
      "ba602b7d-6384-40f4-bbdd-c1c327d9d90d",
      "1a2e2336-f4e4-4bce-9d3c-6352927c0835",
    ];
    dispatch(
      initialSync([
        {
          uuid: TANKS[0],
          coordinateX: 0,
          coordinateY: 1,
          range: 1,
          health: 3,
        },
      ])
    );

    dispatch(
      addTank({
        uuid: TANKS[1],
        coordinateX: 1,
        coordinateY: 1,
        range: 2,
        health: 3,
      })
    );

    dispatch(
      updateTank({
        uuid: TANKS[0],
        coordinateX: 0,
        coordinateY: 2,
        range: 1,
        health: 3,
      })
    );

    dispatch(
      addTank({
        uuid: TANKS[2],
        coordinateX: 2,
        coordinateY: 0,
        range: 2,
        health: 3,
      })
    );

    dispatch(removeTank(TANKS[2]));
  }, [dispatch]);

  return (
    <div style={{ alignItems: "center", justifyContent: "center" }}>
      <GameBoard />
    </div>
  );
}

export default App;
