import { model } from "mongoose";

import userSchema from "./user/user.schema";
import { IUserSchema } from "./user/user.schema";
import tankSchema from "./tank/tank.schema";
import { ITankSchema } from "./tank/tank.schema";

const User = model<IUserSchema>("users", userSchema);
const Tank = model<ITankSchema>("tanks", tankSchema);

export { User, Tank };
