import Square from "./Square";
import * as constants from "../../constants";

export default function Squares() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Use flexbox to organise each child vertically

        // Define overall board size
        height: constants.ROWS * constants.SQUARE_SIZE,
        width: constants.COLUMNS.length * constants.SQUARE_SIZE,
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
                constants.COLUMNS[columnNumber] + rowNumber.toString();

              return <Square key={squareKey} squareKey={squareKey}></Square>;
            })}
          </div>
        );
      })}
    </div>
  );
}
