import { useState, useEffect } from "react";
import React from "react";
import Square from "./components/Square";
import "./App.css";

const App = () => {
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [finished, setFinished] = useState(false);
  const [newGameBool, setNewGameBool] = useState(false);
  const [scoreBoard, setScoreBoard] = useState(Array(3).fill(0));
  const [computer] = useState("O");
  const allSquaresFilled = squares.every((value) => value !== "");

  const handleSquareClick = (index) => {
    if (!finished) {
      const newSquares = [...squares];
      newSquares[index] = turn;
      setSquares(newSquares);
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  useEffect(() => {
    let winner = checkWinner(squares);
    if ((winner || allSquaresFilled) && !finished) {
      const newScoreBoard = [...scoreBoard];
      setWinner(winner);
      setFinished(true);
      if (winner === computer) {
        newScoreBoard[0] += 1;
      } else if (winner === "X") {
        newScoreBoard[1] += 1;
      } else {
        newScoreBoard[2] += 1;
      }
      setScoreBoard(newScoreBoard, allSquaresFilled);
    }
  }, [squares, scoreBoard, allSquaresFilled, computer, finished]);

  const checkWinner = (squares) => {
    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of combos) {
      const [a, b, c] = combo;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const newGame = () => {
    setSquares(Array(9).fill(""));
    setNewGameBool(true);
    setFinished(false);
    setWinner(null);
    setTurn("X");
  };

  const getOpenMoves = (squares) => {
    return squares
      .map((square, i) => {
        if (square === "") {
          return i;
        }
        return null;
      })
      .filter((square) => square !== null);
  };

  const miniMaxHelper = (squares, depth, turn) => {
    let optimalScore = null;
    const winner = checkWinner(squares);
    if (winner !== null) {
      return winner === "X" ? 1 : -1;
    } else if (squares.every((val) => val !== "")) {
      return 0;
    }

    let pMoves = getOpenMoves(squares);
    if (turn === "X") {
      optimalScore = -Infinity;
    } else {
      optimalScore = Infinity;
    }
    pMoves.forEach((move) => {
      const newSquares = [...squares];
      newSquares[move] = turn;
      const score = miniMaxHelper(
        newSquares,
        depth + 1,
        turn === "X" ? "O" : "X"
      );
      if (turn === "X") {
        optimalScore = Math.max(optimalScore, score);
      } else {
        optimalScore = Math.min(optimalScore, score);
      }
    });

    return optimalScore;
  };

  const minimax = (squares) => {
    let bestMove = null;
    let optimalScore = null;
    if (turn === "X") {
      optimalScore = -Infinity;
    } else {
      optimalScore = Infinity;
    }
    let pMoves = getOpenMoves(squares);
    pMoves.forEach((move) => {
      const newSquares = [...squares];
      newSquares[move] = turn;
      const score = miniMaxHelper(newSquares, 0, turn === "X" ? "O" : "X");
      if (turn === "X") {
        if (score > optimalScore) {
          optimalScore = score;
          bestMove = move;
        }
      } else {
        if (score < optimalScore) {
          optimalScore = score;
          bestMove = move;
        }
      }
    });
    return bestMove;
  };

  useEffect(() => {
    if (turn === computer) {
      let move = minimax(squares);
      handleSquareClick(move);
    }
  }, [turn, squares, computer]);

  return (
    <div className="app">
      <div className="title-bar">
        <h1>Tic Tac Toe</h1>
      </div>
      <div className="app-container">
        <div className="main-container">
          <div className="tic-tac-toe-container">
            <div className="tic-tac-toe">
              {squares.map((value, index) => (
                <Square
                  key={index}
                  turn={turn}
                  onClick={() => handleSquareClick(index)}
                  finished={finished}
                  newGame={newGameBool}
                  setNewGameBool={setNewGameBool}
                  val={value}
                />
              ))}
            </div>
          </div>

          {allSquaresFilled || winner ? (
            <h2>Winner: {winner === null ? `Draw!` : winner}</h2>
          ) : (
            <div style={{ visibility: "hidden", height: "91px" }}></div>
          )}
          <button className="newGame-button" onClick={newGame}>
            New game
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
