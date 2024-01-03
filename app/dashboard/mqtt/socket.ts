import { io } from "socket.io-client";

export default function useSocket() {
  const socket = io("http://192.168.2.114:5001");
  socket.on("connect", () => {
    console.log(socket.connected, "👻");
  });
}
