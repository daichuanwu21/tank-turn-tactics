import { useMemo } from "react";
import * as constants from "../../constants";

export default function Tank({ position }) {
  const locationInPixels = useMemo(() => {
    const [column, rowNum] = position.split("_");
    const columnNum = constants.COLUMNS.indexOf(column);

    const topOffset =
      2 + // Account for padding
      rowNum * 2 + // Account for padding
      rowNum * constants.SQUARE_SIZE;

    const leftOffset =
      2 + // Account for padding
      columnNum * 2 + // Account for padding
      columnNum * constants.SQUARE_SIZE;

    return [topOffset, leftOffset];
  }, [position]);

  return (
    <div
      style={{
        height: constants.SQUARE_SIZE,
        width: constants.SQUARE_SIZE,

        position: "absolute",
        top: locationInPixels[0],
        left: locationInPixels[1],
      }}
    >
      <p>Occupied</p>
    </div>
  );
}
