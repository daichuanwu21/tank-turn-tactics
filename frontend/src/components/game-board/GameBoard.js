import { useSelector } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "./Grid";
import Tank from "./Tank";

export default function GameBoard() {
  const tanks = useSelector((state) => state.tanks);
  return (
    <div
      style={{
        position: "relative", // Allow this div to act as parent div for children with absolute positioning
      }}
    >
      <TransformWrapper>
        <TransformComponent
          wrapperStyle={{
            maxWidth: "100%",
            maxHeight: "calc(100vh - 48px)", // Account for bottom accordion
          }}
        >
          <div>
            <Grid />
            {tanks.map((tank) => {
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
      <Accordion
        sx={{
          position: "fixed",
          width: "100%",
          bottom: 0,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
