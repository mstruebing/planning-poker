import { useEffect, useState } from "react";
import "./App.css";

const ws = new WebSocket("wss://planning-server.maex.me");

const POSSIBLE_VOTES = ["?", 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const shouldShowResults = (votings) => {
  return votings.every((v) => v !== null);
};

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
        <button className="reset" onClick={reset}>
          RESET
        </button>
        <div className="vote">
          {POSSIBLE_VOTES.map((possibleVote) => (
            <button
              className={vote === possibleVote ? "active" : ""}
              onClick={() => setVote(possibleVote)}
              key={possibleVote}
            >
              {possibleVote}
            </button>
          ))}
        </div>
        <div>
          <h2>votings:</h2>
          {votings.map((v, index) => (
            <span key={index} className="result">
              {shouldShowResults(votings) === true ? v : v ? "x" : ""}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
