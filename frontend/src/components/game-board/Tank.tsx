import { useMemo } from "react";
import * as constants from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ITankDocument } from "../../redux/game-api";

interface ITankProps {
  tank: ITankDocument;
}

export default function Tank({ tank }: ITankProps) {
  const auth = useSelector((state) => (state as RootState).auth);

  // Calculate pixel position on grid from tank coordinates
  const positionOnGrid = useMemo(() => {
    const topOffset = tank.positionY * constants.SQUARE_SIZE;

    const leftOffset = tank.positionX * constants.SQUARE_SIZE;

    return [topOffset, leftOffset];
  }, [tank]);

  const tankColour = useMemo(() => {
    const limitedRange = tank.range > 5 ? 5 : tank.range;

    const colour1 = [140, 140, 140]; // grey
    let colour2 = [50, 222, 132]; // green
    if (auth.loggedIn) colour2 = [255, 215, 0]; // gold

    if (tank.healthPoints <= 0) {
      return `${colour1[0]},${colour1[1]},${colour1[2]},0.5`;
    }

    // Interpolate between dull and bright colour to show range
    const red = (colour2[0] - colour1[0]) * (limitedRange / 5) + colour1[0];
    const green = (colour2[1] - colour1[1]) * (limitedRange / 5) + colour1[1];
    const blue = (colour2[2] - colour1[2]) * (limitedRange / 5) + colour1[2];

    return `${red},${green},${blue},0.5`;
  }, [tank, auth]);

  const healthText = useMemo(() => {
    if (tank.healthPoints <= 0) {
      return "💀";
    }

    if (tank.healthPoints <= 3) {
      return "❤️".repeat(tank.healthPoints);
    }

    return `❤️ ${tank.healthPoints}`;
  }, [tank]);

  return (
    <div
      style={{
        height: constants.SQUARE_SIZE,
        width: constants.SQUARE_SIZE,

        // Hacky way to place Tanks on the grid
        // i.e. use grid as parent div with absolute positioning and calculated offsets to place Tank
        position: "absolute",
        top: positionOnGrid[0],
        left: positionOnGrid[1],
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          height: constants.SQUARE_SIZE,

          justifyContent: "center",
          alignItems: "center",

          borderRadius: 15,
          backgroundColor: `rgba(${tankColour})`,
        }}
      >
        <p style={{ margin: 0 }}>{tank.displayName}</p>
        <p style={{ margin: 0 }}>{healthText}</p>
        <p style={{ margin: 0 }}>R: {tank.range}</p>
      </div>
    </div>
  );
}
