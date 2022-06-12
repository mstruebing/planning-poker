import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { getAllVotes, resetStore, redis } from "./store";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.adapter(createAdapter(redis.duplicate(), redis.duplicate()));

httpServer.listen(8080);

io.on("connection", async (socket) => {
  await redis.set(socket.id, "");

  // Broadcast votes also sends all votes to the
  // socket responsible for triggering the broadcast
  const broadcastVotes = async () => {
    const allVotes = await getAllVotes();
    socket.emit("VOTINGS", allVotes);
    socket.broadcast.emit("VOTINGS", allVotes);
  };

  broadcastVotes();

  // Debug logs
  socket.onAny((event, ...args) => {
    console.log(`got event: ${event}, with args: ${JSON.stringify(args)}`);
  });

  socket.on("VOTE", async (data) => {
    await redis.set(socket.id, data as string);
    await broadcastVotes();
  });

  socket.on("RESET", async () => {
    await resetStore();
    socket.broadcast.emit("RESET");
    broadcastVotes();
  });

  socket.on("disconnect", async () => {
    await redis.del(socket.id);
    broadcastVotes();
  });
});
