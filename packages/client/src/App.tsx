import React from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./Room";

function App() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = React.useState("");

  const socket = io(`${SOCKET_URL}`, {
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true,
    timestampRequests: true,
  });

  const createNewRoom = () => {
    socket.emit("GET_ROOM");
  };

  React.useEffect(() => {
    socket.on("ROOM_NUMBER", (data) => {
      navigate(`/${data}`);
    });
  }, []);

  const joinRoom = () => {
    return navigate(`/${roomNumber}`);
  };

  return (
    <form className="container mx-auto w-6/12">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          onInput={(e) => setRoomNumber(e.currentTarget.value)}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Room Number"
          aria-label="Room Number"
        />
        <button
          onClick={joinRoom}
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
        >
          Join Room
        </button>
      </div>

      <div className="flex items-center py-2">
        <button
          onClick={createNewRoom}
          className="w-full bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
        >
          Create a New Room
        </button>
      </div>
    </form>
  );
}

export default App;
