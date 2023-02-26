import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  const className = "square" + (props.isWinnerLine ? " winnerLine" : "");
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardRows = Array(3).fill(null).map((_, row) => (
      <div className="board-row" key={row}>
        {Array(3).fill(null).map((_, col) => this.renderSquare(row * 3 + col))}
      </div>
    ));

    return (
      <div>
        <h1>Tic Tac Toe</h1>
        {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastMove: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const lastMove = { row: Math.floor(i / 3) + 1, col: i % 3 + 1 };
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastMove: lastMove,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  restartGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          lastMove: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move -> ${move} (${step.lastMove.row}, ${step.lastMove.col})` :
        'Go to game start';
      return (
        <li key={move}>
          <button className='button' onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
      let status;
      if (winner) {
        status = "Winner: " + winner;
      }else if (current.squares.every((item) => item !== null)){
        status = "Draw";
      }
       else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className='status'>{status}</div>
            <button className='restart' onClick={() => this.restartGame()}>Restart Game</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  