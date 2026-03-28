import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [bugPosition, setBugPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  // Move bug randomly
  const moveBug = () => {
    const x = Math.random() * 80;
    const y = Math.random() * 80;
    setBugPosition({ x, y });
  };

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Move bug every 800ms
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(moveBug, 800);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleClick = () => {
    if (!gameOver) {
      setScore(score + 1);
      moveBug();
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
  };

  return (
    <div className="app">
      <h1>🐛 Catch the Bug!</h1>

      <div className="info">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      <div className="game-area">
        {!gameOver && (
          <div
            className="bug"
            style={{
              top: `${bugPosition.y}%`,
              left: `${bugPosition.x}%`,
            }}
            onClick={handleClick}
          >
            🐛
          </div>
        )}

        {gameOver && (
          <div className="game-over">
            <h2>Game Over 😅</h2>
            <p>Your Score: {score}</p>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
