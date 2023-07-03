import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Grid from "./Grid";
import Tank from "./Tank";
import { useEffect, useMemo, useState } from "react";
import * as constants from "../../constants";
import { ITankDocument, useTanksQuery } from "../../redux/game-api";

const getViewportSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export default function GameBoard() {
  // Listen to changes in viewport size
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  }>(getViewportSize());
  useEffect(() => {
    const handleWindowResize = () => setViewportSize(getViewportSize());

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Calculate minimum scaling required to keep board filling screen
  const calculatedScale = useMemo((): number | undefined => {
    const containerSize = {
      width: constants.COLUMNS.length * constants.SQUARE_SIZE,
      height: constants.ROWS * constants.SQUARE_SIZE,
    };

    const widthScale = viewportSize.width / containerSize.width;
    const heightScale = viewportSize.height / containerSize.height;

    if (viewportSize.width >= containerSize.width) {
      if (viewportSize.height >= containerSize.height) {
        return Math.max(widthScale, heightScale);
      } else {
        return widthScale;
      }
    } else {
      if (viewportSize.height >= containerSize.height) {
        return heightScale;
      } else {
        return 1;
      }
    }
  }, [viewportSize]);

  const { data, error, isLoading } = useTanksQuery(undefined);
  return (
    <div
      style={{
        position: "relative", // Allow this div to act as parent div for children with absolute positioning
      }}
    >
      {error ? (
        <h1>Uh oh, there was an error</h1>
      ) : isLoading ? (
        <h1>Syncing with server...</h1>
      ) : data ? (
        <>
          {calculatedScale === undefined ? null : (
            <TransformWrapper
              key={`${viewportSize.width}x${viewportSize.height}`}
              initialScale={calculatedScale}
              minScale={calculatedScale}
              maxScale={calculatedScale * 6}
              centerOnInit
            >
              <TransformComponent
                wrapperStyle={{
                  width: "100vw",
                  height: "100vh",
                }}
              >
                <div>
                  <Grid />

                  {data.ids.map((tankId: any) => {
                    if (!data.entities[tankId]) return;
                    const tankDoc = data.entities[tankId] as ITankDocument;

                    return (
                      <Tank
                        key={tankDoc.id}
                        displayName={tankDoc.displayName}
                        positionX={tankDoc.positionX}
                        positionY={tankDoc.positionY}
                        range={tankDoc.range}
                        health={tankDoc.healthPoints}
                      />
                    );
                  })}
                </div>
              </TransformComponent>
            </TransformWrapper>
          )}
        </>
      ) : null}
    </div>
  );
}
