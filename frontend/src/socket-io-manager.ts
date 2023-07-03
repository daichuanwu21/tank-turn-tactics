import { Manager } from "socket.io-client";

const SocketIOManager = new Manager(
  `${process.env.REACT_APP_API_USE_HTTPS === "YES" ? "https://" : "http://"}${
    process.env.REACT_APP_API_DOMAIN
  }`
);

export default SocketIOManager;
