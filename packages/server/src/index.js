import { WebSocketServer, WebSocket } from "ws";
import { v4 } from "uuid";

const wss = new WebSocketServer({ port: 8080 });

const sendVotings = () => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          event: "VOTINGS",
          payload: {
            votings: [...wss.clients].map((client) => client.vote),
          },
        })
      );
    }
  });
};

wss.getUniqueID = v4;

wss.on("connection", function connection(ws) {
  ws.id = wss.getUniqueID();
  ws.vote = null;

  sendVotings();

  ws.on("message", function message(data) {
    const { event, payload } = JSON.parse(data);

    if (event === "RESET") {
      wss.clients.forEach(function each(client) {
        client.vote = null;
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ event: "RESET", payload: null }));
        }
      });
      sendVotings();
    }

    if (event === "VOTE") {
      ws.vote = payload.vote;
      sendVotings();
    }
  });

  ws.on("close", function close() {
    sendVotings();
  });
});
