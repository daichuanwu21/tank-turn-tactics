import * as constants from "../../constants";
export default function Square({ squareKey }) {
  return (
    <div
      style={{
        height: constants.SQUARE_SIZE,
        width: constants.SQUARE_SIZE,

        border: "1px solid grey",

        // Force coordinate label to appear on bottom-right
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      <p
        style={{
          margin: 0, // Override user agent stylesheet
        }}
      >
        {squareKey}
      </p>
    </div>
  );
}
