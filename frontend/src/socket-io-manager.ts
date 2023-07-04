import { Manager } from "socket.io-client";
import * as constants from "./constants";

const SocketIOManager = new Manager(constants.API_ENDPOINT);

export default SocketIOManager;
