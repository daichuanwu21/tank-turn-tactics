import { useSelector } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Grid from "./Grid";
import Tank from "./Tank";
import { useEffect, useMemo, useState } from "react";
import * as constants from "../../constants";

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

  const tanks = useSelector((state: any) => state.tanks);
  return (
    <div
      style={{
        position: "relative", // Allow this div to act as parent div for children with absolute positioning
      }}
    >
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
              {tanks.map((tank: any) => {
                return (
                  <Tank
                    key={tank.uuid}
                    coordinateX={tank.coordinateX}
                    coordinateY={tank.coordinateY}
                    range={tank.range}
                    health={tank.health}
                    ap={tank.ap}
                  />
                );
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
}
