import { ServerResponse, IncomingMessage } from "http";
import APIError from "../error/api.error";
import { StatusCodes } from "http-status-codes";

const verifyJSON = (
  req: IncomingMessage,
  res: ServerResponse,
  buf: Buffer,
  encoding: string
): void => {
  if (!Buffer.isEncoding(encoding))
    throw new APIError(
      StatusCodes.BAD_REQUEST,
      "Unsupported JSON encoding!",
      true
    );

  try {
    const decodedBuffer = buf.toString(encoding);
    JSON.parse(decodedBuffer);
  } catch (err) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid JSON received!", true);
  }
};

export default verifyJSON;
