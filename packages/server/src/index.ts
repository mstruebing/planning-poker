import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Cluster } from "ioredis";

import { store, getAllVotes, resetStore } from "./store";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

if (process.env.REDIS_URL === undefined) {
  throw new Error("Please provide an `REDIS_URL`");
}

const pubClient = new Cluster([
  {
    host: process.env.REDIS_URL,
    port: 6379,
  },
]);

const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

httpServer.listen(8080);

io.on("connection", (socket) => {
  store[socket.id] = {
    vote: null,
  };

  // Broadcast votes also sends all votes to the
  // socket responsible for triggering the broadcast
  const broadcastVotes = () => {
    const allVotes = getAllVotes(store);
    socket.emit("VOTINGS", allVotes);
    socket.broadcast.emit("VOTINGS", allVotes);
  };

  broadcastVotes();

  // Debug logs
  socket.onAny((event, ...args) => {
    console.log(`got ${event}, with args: ${JSON.stringify(args)}`);
  });

  socket.on("VOTE", (data) => {
    store[socket.id].vote = data;
    broadcastVotes();
  });

  socket.on("RESET", () => {
    resetStore(store);
    socket.broadcast.emit("RESET");
    broadcastVotes();
  });

  socket.on("disconnect", function () {
    delete store[socket.id];
    broadcastVotes();
  });
});
