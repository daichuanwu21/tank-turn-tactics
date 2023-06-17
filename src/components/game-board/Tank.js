import { useMemo } from "react";
import * as constants from "../../constants";

export default function Tank({
  coordinateX,
  coordinateY,
  range,
  health,
  ap = null,
}) {
  const calculatedOffset = useMemo(() => {
    const topOffset =
      2 + // Account for padding
      coordinateY * 2 + // Account for padding
      coordinateY * constants.SQUARE_SIZE;

    const leftOffset =
      2 + // Account for padding
      coordinateX * 2 + // Account for padding
      coordinateX * constants.SQUARE_SIZE;

    return [topOffset, leftOffset];
  }, [coordinateX, coordinateY]);

  const tankColour = useMemo(() => {
    const limitedRange = range > 5 ? 5 : range;

    const colour1 = [169, 169, 169]; // darkgrey
    const colour2 = [0, 255, 255]; // cyan

    const red = (colour2[0] - colour1[0]) * (limitedRange / 5) + colour1[0];
    const green = (colour2[1] - colour1[1]) * (limitedRange / 5) + colour1[1];
    const blue = (colour2[2] - colour1[2]) * (limitedRange / 5) + colour1[2];

    return `${red},${green},${blue}`;
  }, [range]);

  return (
    <div
      style={{
        height: constants.SQUARE_SIZE,
        width: constants.SQUARE_SIZE,

        // Hacky way to place Tanks over the grid
        // i.e. use grid as parent div with absolute positioning and calculated offsets to place Tank
        position: "absolute",
        top: calculatedOffset[0],
        left: calculatedOffset[1],
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
          backgroundColor: `rgb(${tankColour})`,
        }}
      >
        <p style={{ margin: 0 }}>{"❤️".repeat(health)}</p>
        <p style={{ margin: 0 }}>R: {range}</p>
        {ap !== null && <p style={{ margin: 0 }}>AP: {ap}</p>}
      </div>
    </div>
  );
}
