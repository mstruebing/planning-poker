import { initialize, redis } from "./server";

const io = initialize();

const getFreeRandomRoom = async () => {
  const rooms = await redis.smembers("rooms");

  while (true) {
    const random = Math.random().toString(16).substr(2, 8);
    if (!rooms.includes(`/${random}`)) {
      return random;
    }
  }
};

io.on("connection", async (socket) => {
  socket.on("GET_ROOM", async () => {
    const roomNumber = await getFreeRandomRoom();
    socket.emit("ROOM_NUMBER", roomNumber);
  });
});

const rooms = io.of(/^\/\w+$/);

rooms.on("connection", async (socket) => {
  // A set to store which rooms are used, which is needed to provide the user
  // with a room id
  await redis.sadd("rooms", socket.nsp.name);

  // Broadcast votes also sends all votes to the
  // socket responsible for triggering the broadcast
  const broadcastVotes = async () => {
    const allVotes: string[] = [];

    socket.nsp.sockets.forEach((socket) => {
      allVotes.push(socket.data.vote as string);
    });

    socket.emit("VOTINGS", allVotes);
    socket.broadcast.emit("VOTINGS", allVotes);
  };

  broadcastVotes();

  // Debug logs
  socket.onAny((event, ...args) => {
    console.log(
      `got event: ${event}, with args: ${JSON.stringify(args)} for room: ${
        socket.nsp.name
      }`
    );
  });

  socket.on("VOTE", async (vote) => {
    socket.data.vote = vote;
    await broadcastVotes();
  });

  socket.on("RESET", async () => {
    socket.nsp.sockets.forEach((socket) => {
      socket.data.vote = null;
    });

    socket.broadcast.emit("RESET");
    broadcastVotes();
  });

  socket.on("disconnect", async () => {
    if (socket.nsp.sockets.size === 0) {
      await redis.srem("rooms", socket.nsp.name);
    }

    broadcastVotes();
  });
});
