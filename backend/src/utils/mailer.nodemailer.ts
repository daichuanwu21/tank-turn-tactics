import { createTransport } from "nodemailer";
import config from "../config";

const emailTransporter = createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailSecure,
  auth: {
    user: config.emailAuthUser,
    pass: config.emailAuthPass,
  },
});

export default emailTransporter;
