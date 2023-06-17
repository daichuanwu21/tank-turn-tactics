import { useSelector } from "react-redux";
import Grid from "./Grid";
import Tank from "./Tank";

export default function GameBoard() {
  const tanks = useSelector((state) => state.tanks);
  return (
    <div style={{ position: "absolute" }}>
      <Grid />
      {tanks.map((tank) => {
        return (
          <Tank
            key={tank.uuid}
            coordinateX={tank.coordinateX}
            coordinateY={tank.coordinateY}
            range={tank.range}
            health={tank.health}
            ap={tank.ap}
          />
        );
      })}
    </div>
  );
}
