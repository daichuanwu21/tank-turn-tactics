import { useMemo } from "react";
import * as constants from "../../constants";

interface ITankProps {
  displayName: string;
  positionX: number;
  positionY: number;
  range: number;
  health: number;
}

export default function Tank(props: ITankProps) {
  const { displayName, positionX, positionY, range, health } = props;
  // Calculate pixel position on grid from tank coordinates
  const positionOnGrid = useMemo(() => {
    const topOffset = positionY * constants.SQUARE_SIZE;

    const leftOffset = positionX * constants.SQUARE_SIZE;

    return [topOffset, leftOffset];
  }, [positionX, positionY]);

  const tankColour = useMemo(() => {
    const limitedRange = range > 5 ? 5 : range;

    const colour1 = [169, 169, 169]; // darkgrey
    const colour2 = [0, 255, 255]; // cyan

    // Interpolate between dull and bright colour to show range
    const red = (colour2[0] - colour1[0]) * (limitedRange / 5) + colour1[0];
    const green = (colour2[1] - colour1[1]) * (limitedRange / 5) + colour1[1];
    const blue = (colour2[2] - colour1[2]) * (limitedRange / 5) + colour1[2];

    return `${red},${green},${blue},0.5`;
  }, [range]);

  const healthText = useMemo(() => {
    if (health <= 3) {
      return "❤️".repeat(health);
    }

    return `❤️ ${health}`;
  }, [health]);

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

          height: constants.SQUARE_SIZE - 26, // offset is 2x margin
          margin: 13,

          justifyContent: "center",
          alignItems: "center",

          borderRadius: 15,
          backgroundColor: `rgba(${tankColour})`,
        }}
      >
        <p style={{ margin: 0 }}>{displayName}</p>
        <p style={{ margin: 0 }}>{healthText}</p>
        <p style={{ margin: 0 }}>R: {range}</p>
      </div>
    </div>
  );
}
