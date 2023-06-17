import { useMemo } from "react";
import * as constants from "../../constants";

export default function Tank({ coordinateX, coordinateY }) {
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

  return (
    <div
      style={{
        height: constants.SQUARE_SIZE,
        width: constants.SQUARE_SIZE,

        position: "absolute",
        top: calculatedOffset[0],
        left: calculatedOffset[1],
      }}
    >
      <p>Occupied</p>
    </div>
  );
}
