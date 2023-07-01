import { Router } from "express";
import { expressjwt } from "express-jwt";
import { checkSchema } from "express-validator";
import config from "../config";
import asyncWrapper from "../utils/async-wrapper.function";
import tankMoveController from "./tank-move.controller";
import tankShootController from "./tank-shoot.controller";
import tankUpgradeRangeController from "./tank-upgrade-range.controller";
import tankAddHealthPointController from "./tank-add-health-point.controller";

const tanksRouter = Router();

tanksRouter.post(
  "/:tankId/move",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
    tankId: {
      isAlphanumeric: true,
      isLength: {
        options: {
          min: 24,
          max: 24,
        },
      },
      errorMessage: "Invalid tankId supplied!",
    },
    positionX: {
      isInt: {
        options: {
          allow_leading_zeroes: false,
          min: 0,
          max: config.gridXSize - 1,
        },
      },
      errorMessage: "Invalid positionX supplied!",
    },
    positionY: {
      isInt: {
        options: {
          allow_leading_zeroes: false,
          min: 0,
          max: config.gridYSize - 1,
        },
      },
      errorMessage: "Invalid positionY supplied!",
    },
  }),
  asyncWrapper(tankMoveController)
);

tanksRouter.post(
  "/:tankId/shoot",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
    tankId: {
      isAlphanumeric: true,
      isLength: {
        options: {
          min: 24,
          max: 24,
        },
      },
      errorMessage: "Invalid tankId supplied!",
    },
    targetTankId: {
      isAlphanumeric: true,
      isLength: {
        options: {
          min: 24,
          max: 24,
        },
      },
      errorMessage: "Invalid targetTankId supplied!",
    },
  }),
  asyncWrapper(tankShootController)
);

tanksRouter.post(
  "/:tankId/upgrade-range",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
    tankId: {
      isAlphanumeric: true,
      isLength: {
        options: {
          min: 24,
          max: 24,
        },
      },
      errorMessage: "Invalid tankId supplied!",
    },
  }),
  asyncWrapper(tankUpgradeRangeController)
);

tanksRouter.post(
  "/:tankId/add-health-point",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
    tankId: {
      isAlphanumeric: true,
      isLength: {
        options: {
          min: 24,
          max: 24,
        },
      },
      errorMessage: "Invalid tankId supplied!",
    },
  }),
  asyncWrapper(tankAddHealthPointController)
);

export default tanksRouter;
