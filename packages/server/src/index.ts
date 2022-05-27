import { WebSocketServer, WebSocket } from "ws";
import { v4 } from "uuid";

interface EnhancedWebsocket extends WebSocket {
  id: string;
  vote: string | null;
}

const wss = new WebSocketServer<EnhancedWebsocket>({ port: 8080 });

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

wss.on("connection", (ws) => {
  ws.id = v4();
  ws.vote = null;

  sendVotings();

  ws.on("message", (data) => {
    const { event, payload } = JSON.parse(data.toString());

    if (event === "RESET") {
      wss.clients.forEach((client: EnhancedWebsocket) => {
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

  ws.on("close", () => {
    sendVotings();
  });
});
