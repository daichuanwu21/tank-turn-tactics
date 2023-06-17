import * as constants from "../../constants";
export default function Square({ squareKey, children }) {
  return (
    <div
      style={{
        height: constants.SQUARE_SIZE,
        width: constants.SQUARE_SIZE,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>{squareKey}</p>
      {children}
    </div>
  );
}
