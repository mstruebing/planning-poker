import { useEffect, useState } from "react";
import "./App.css";

const ws = new WebSocket("wss://planning-server.maex.me");

const POSSIBLE_VOTES = ["?", 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const shouldShowResults = (votings: Array<string | null>) => {
  return votings.every((v) => v !== null);
};

const VOTE_BUTTON_STYLE = "p-4 rounded-md text-white hover:-translate-y-0.5";

const VOTE_BUTTON_STYLE_ACTIVE = "bg-gradient-to-r from-green-400 to-green-500";
const VOTE_BUTTON_STYLE_INACTIVE =
  "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 border-2 border-blue-700 hover:border-blue-800";

function App() {
  const [vote, setVote] = useState(null);
  const [votings, setVotings] = useState([]);

  useEffect(() => {
    ws.onmessage = function ({ data }) {
      const { event, payload } = JSON.parse(data);

      if (event === "RESET") {
        setVote(null);
      }

      if (event === "VOTINGS") {
        setVotings(payload.votings);
      }
    };
  }, []);

  useEffect(() => {
    if (vote !== null) {
      ws.send(JSON.stringify({ event: "VOTE", payload: { vote } }));
    }
  }, [vote]);

  const reset = () => {
    ws.send(JSON.stringify({ event: "RESET" }));
  };

  return (
    <div className="App">
      <main>
        <button
          className="my-4 border-2 rounded-full p-2 border-blue-200"
          onClick={reset}
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
                {shouldShowResults(votings) === true ? v : v ? "x" : "?"}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
