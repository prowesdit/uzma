import { Server } from "socket.io";

let io: Server | undefined;

export function getIO() {
  if (!io) {
    io = new Server(3001, {
      cors: { origin: "*" },
    });
  }
  return io;
}
