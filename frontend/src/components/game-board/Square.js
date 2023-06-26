import * as constants from "../../constants";
export default function Square({ squareKey }) {
  const boxMargin = 4;
  return (
    <div
      style={{
        height: constants.SQUARE_SIZE - 2 * boxMargin,
        width: constants.SQUARE_SIZE - 2 * boxMargin,

        // Force coordinate label to appear on bottom-right
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",

        borderRadius: 15,
        backgroundColor: "#b2b2b2",
        boxShadow: "6px 6px 6px #b2b2b2 inset, -3px -3px 4px #b2b2b2 inset",
        margin: boxMargin,
      }}
    >
      <p
        style={{
          margin: 3, // Override user agent stylesheet
        }}
      >
        {squareKey}
      </p>
    </div>
  );
}
