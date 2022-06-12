import { createServer } from "http";
import { Server } from "socket.io";

import { store, getAllVotes, resetStore } from "./store";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

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
