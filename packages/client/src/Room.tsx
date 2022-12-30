import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./Room.css";

import { shouldShowResults, POSSIBLE_VOTES, average } from "./votings";

export const SOCKET_URL =
  window.__RUNTIME_CONFIG__?.SOCKET_URL ?? "ws://localhost:8080";

const getSocket = (pathname: string) => {
  const socket = io(`${SOCKET_URL}${pathname}`, {
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true,
    timestampRequests: true,
  });
  return socket;
};

const VOTE_BUTTON_STYLE = "p-4 rounded-md text-white hover:-translate-y-0.5";

const VOTE_BUTTON_STYLE_ACTIVE = "bg-gradient-to-r from-green-400 to-green-500";
const VOTE_BUTTON_STYLE_INACTIVE =
  "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 border-2 border-blue-700 hover:border-blue-800";

function Room() {
  const [vote, setVote] = useState("");
  const [votings, setVotings] = useState([]);
  const [socket, setSocket] = useState<Socket>();

  // Resets the local vote
  const reset = () => {
    setVote("");
  };

  const handleClickReset = () => {
    if (socket) {
      reset();
      socket.emit("RESET");
    }
  };

  // Initialize the socket whenever this component mounts or
  // the pathname changes
  useEffect(() => {
    // @ts-ignore
    if (socket?.nsp !== window.location.pathname) {
      const sock = getSocket(window.location.pathname);
      setSocket(sock);

      return () => {
        sock.disconnect();
      };
    }
  }, [window.location.pathname]);

  // Initialize socket listeners
  useEffect(() => {
    if (socket) {
      socket.on("RESET", reset);

      socket.on("VOTINGS", (data) => {
        setVotings(data);
      });
    }
  }, [socket]);

  // Send vote
  useEffect(() => {
    if (socket && vote !== "") {
      socket.emit("VOTE", vote);
    }
  }, [socket, vote]);

  const showResults = shouldShowResults(votings);

  return (
    <div className="App">
      <main>
        <button
          className="my-4 border-2 rounded-full p-2 border-blue-200"
          onClick={handleClickReset}
        >
          RESET
        </button>
        <div className="flex justify-center space-x-4 mb-4">
          {POSSIBLE_VOTES.map((possibleVote) => (
            <button
              className={`${VOTE_BUTTON_STYLE} ${
                vote === possibleVote
                  ? VOTE_BUTTON_STYLE_ACTIVE
                  : VOTE_BUTTON_STYLE_INACTIVE
              }`}
              // @ts-ignore
              onClick={() => setVote(possibleVote)}
              key={possibleVote}
            >
              {possibleVote}
            </button>
          ))}
        </div>
        <div>
          <div className="mb-4">Results:</div>
          <div className="flex justify-center space-x-2">
            {votings.map((v, index) => (
              <span
                key={index}
                className="border-2 border-blue-200 p-4 rounded-md"
              >
                {showResults ? v : v ? "x" : "?"}
              </span>
            ))}
          </div>
          <div>{showResults && `Average: ${average(votings)}`}</div>
        </div>
      </main>
    </div>
  );
}

export default Room;
