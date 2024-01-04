import { io } from "socket.io-client";

export default function useSocket() {
  const socket = io("http://192.168.2.114:5001");
  socket.on("transmit_data", (data) => {
    let location_record_is_running_statue = data.location_record_is_running;
    let rpi_temperature = data.rpi_temperature;
  });
  socket.on("status", () => {
    startHandler();
  });
  function startHandler() {
    socket.emit("start");
  }
}
