import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: 'green',
    color: "white"
  };

  return (
    <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        onClick={() => this.props.onClick(i)}
        value={this.props.squares[i]}
        winningSquare = {winningSquare}
      />
    );
  }

  render() {
    let boardSquares = [];
    for (let row = 0; row < 3; row++)
    {
      let boardRow = [];
      for (let col = 0; col < 3; col++)
      {
        boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const position = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        column: position[i][0],
        row: position[i][1],
        player: !this.state.xIsNext,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHandleClick(){
    this.setState({
      ascending: !this.state.ascending
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Tour n°' + move :
        'Début de la partie';
        return (
          <>
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
              {
                move === 0 ?
                null
                :
                move === this.state.stepNumber ?
                  <b><div>{(history[move].player) ? "O" : "X"} Place on {"{"}{history[move].column}; {history[move].row}{"}"}</div></b>
                  :
                  <div>{(history[move].player) ? "O" : "X"} Place on {"{"}{history[move].column}; {history[move].row}{"}"}</div>
              }
            </li>
          </>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else if (!current.squares.includes(null)) {
      status = "Draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner && winner.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{ascending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHandleClick()}>Toggle Sort Order</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i],
      };
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);