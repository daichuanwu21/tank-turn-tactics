import { Router } from "express";
import { expressjwt } from "express-jwt";
import { checkSchema } from "express-validator";
import config from "../config";
import asyncWrapper from "../utils/async-wrapper.function";
import tankMoveController from "./tank-move.controller";
import tankShootController from "./tank-shoot.controller";
import tankUpgradeRangeController from "./tank-upgrade-range.controller";
import tankAddHealthPointController from "./tank-add-health-point.controller";
import tankGiveHealthPointController from "./tank-give-health-point.controller";
import tankGiveActionPointController from "./tank-give-action-point.controller";

const tankRouter = Router();

tankRouter.post(
  "/move",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
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

tankRouter.post(
  "/shoot",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
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

tankRouter.post(
  "/upgrade-range",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  asyncWrapper(tankUpgradeRangeController)
);

tankRouter.post(
  "/add-health-point",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  asyncWrapper(tankAddHealthPointController)
);

tankRouter.post(
  "/give-action-point",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
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
  asyncWrapper(tankGiveActionPointController)
);

tankRouter.post(
  "/give-health-point",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS512"] }),
  checkSchema({
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
  asyncWrapper(tankGiveHealthPointController)
);

export default tankRouter;
