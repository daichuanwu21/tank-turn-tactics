import * as constants from "../../constants";

interface ISquareProps {
  squareKey: string;
}

export default function Square(props: ISquareProps) {
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
          margin: 0, // Override user agent stylesheet
          marginRight: 5,
        }}
      >
        {props.squareKey}
      </p>
    </div>
  );
}
