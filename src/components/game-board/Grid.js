import Square from "./Square";
import * as constants from "../../constants";

export default function Grid() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Use flexbox to organise each child vertically

        // Define overall board size
        height:
          constants.ROWS * constants.SQUARE_SIZE + // Base size of grid
          2 * constants.ROWS, // Account for size added by padding
        width:
          constants.COLUMNS.length * constants.SQUARE_SIZE + // Base size of grid
          2 * constants.COLUMNS.length, // Account for size added by padding

        border: "1px solid grey", // Hacky workaround for outside squares only have 1px of border in total
      }}
    >
      {/* Create the rows first since the column-direction flexbox expects rows of content */}
      {[...Array(constants.ROWS)].map((_, rowNumber) => {
        return (
          <div
            key={rowNumber.toString()}
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {/* Then create the corresponding columns within the rows */}
            {[...Array(constants.COLUMNS.length)].map((_, columnNumber) => {
              const squareKey =
                constants.COLUMNS[columnNumber] + (rowNumber + 1).toString();

              return <Square key={squareKey} squareKey={squareKey} />;
            })}
          </div>
        );
      })}
    </div>
  );
}
