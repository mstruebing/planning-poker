import Redis from "ioredis";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { getRedisURL } from "./config";

export const redis = new Redis(6379, getRedisURL());

export const initialize = () => {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.adapter(createAdapter(redis.duplicate(), redis.duplicate()));

  httpServer.listen(8080);
  return io;
};
