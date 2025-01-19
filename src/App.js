import { useState, useMemo, useEffect } from "react";
import { generateMaze, solve } from "./mazes";
import "./App.css";

export default function App() {
  const [gameId, setGameId] = useState(1);
  const [status, setStatus] = useState("playing");
  const [diff, setSize] = useState(10);
  const [cheatMode, setCheatMode] = useState(false);
  const [userPosition, setUserPosition] = useState([0, 0]);
  const [timeLeft, setTimeLeft] = useState(15);

  const maze = useMemo(() => generateMaze(diff), [diff, gameId]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft > 0 && status === "playing") {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer); // Cleanup timer
    } else if (timeLeft === 0) {
      setStatus("gameOver"); // End game if timer reaches 0
    }
  }, [timeLeft, status]);

  // Reset maze and timer when user reaches the destination
  useEffect(() => {
    const lastRowIndex = maze.length - 1;
    const lastColIndex = maze[0].length - 1;

    if (userPosition[0] === lastRowIndex && userPosition[1] === lastColIndex) {
      setUserPosition([0, 0]); // Reset user position
      setTimeLeft(15); // Reset timer
      setGameId(gameId + 1); // Generate a new maze
    }
  }, [userPosition, maze, gameId]);

  const makeClassName = (i, j) => {
    const rows = maze.length;
    const cols = maze[0].length;
    let arr = [];
    if (maze[i][j][0] === 0) {
      arr.push("topWall");
    }
    if (maze[i][j][1] === 0) {
      arr.push("rightWall");
    }
    if (maze[i][j][2] === 0) {
      arr.push("bottomWall");
    }
    if (maze[i][j][3] === 0) {
      arr.push("leftWall");
    }
    if (i === rows - 1 && j === cols - 1) {
      arr.push("destination");
    }
    if (i === userPosition[0] && j === userPosition[1]) {
      arr.push("currentPosition");
    }
    return arr.join(" ");
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (status !== "playing") {
      return;
    }
    const key = e.code;
    const [i, j] = userPosition;

    if ((key === "ArrowUp" || key === "KeyW") && maze[i][j][0] === 1) {
      setUserPosition([i - 1, j]);
    }
    if ((key === "ArrowRight" || key === "KeyD") && maze[i][j][1] === 1) {
      setUserPosition([i, j + 1]);
    }
    if ((key === "ArrowDown" || key === "KeyS") && maze[i][j][2] === 1) {
      setUserPosition([i + 1, j]);
    }
    if ((key === "ArrowLeft" || key === "KeyA") && maze[i][j][3] === 1) {
      setUserPosition([i, j - 1]);
    }
  };

  const handleUpdateSettings = () => {
    setSize(Number(document.querySelector("input[name='mazeSize']").value));
    setUserPosition([0, 0]);
    setTimeLeft(15); // Reset timer on settings change
    setStatus("playing");
    setGameId(gameId + 1);
  };

  return (
    <div className="App" onKeyDown={handleMove} tabIndex={-1}>
      <div className="setting">
        <label htmlFor="mazeSize">DIFFICULTY:</label>
        <select
          name="Difficulty"
          defaultValue="10"
          onChange={(e) => setSize(Number(e.target.value))}
        >
          <option value="5">Easy</option>
          <option value="10">Medium</option>
          <option value="15">Hard</option>
          <option value="20">Extreme</option>
        </select>
      </div>
      <div className="setting">
        <button onClick={handleUpdateSettings}>
          Restart game with new settings
        </button>
      </div>
      <p>use WSAD or Arrow Keys to move</p>
      <div>
        <label htmlFor="cheatMode">Cheat mode</label>
        <input
          type="checkbox"
          name="cheatMode"
          onChange={(e) => setCheatMode(e.target.checked)}
        />
      </div>

      <div className="timer">
        <p>Time Left: {timeLeft}s</p>
      </div>

      <table id="maze">
        <tbody>
          {maze.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map((cell, j) => (
                <td key={`cell-${i}-${j}`} className={makeClassName(i, j)}>
                  <div />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {status === "gameOver" && (
        <div className="info" onClick={handleUpdateSettings}>
          <p>Time's up! Click here to restart.</p>
        </div>
      )}

      {status === "won" && (
        <div className="info" onClick={handleUpdateSettings}>
          <p>You won! Click here to play again.</p>
        </div>
      )}
    </div>
  );
}
