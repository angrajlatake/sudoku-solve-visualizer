import "./Board.scss";
import { getSudoku } from "sudoku-gen";
import React, { Component } from "react";
const solution = [];
let TIME = 1000;
var timeout = 0;

const emptyGame = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]

class Board extends Component {
  state = {
    puzzle: emptyGame,
    stopSolve: false,
  };
  checkSol = (event) => {
      console.log(event.target)
  }
  handleClear = (event) => {
      this.setState({
          puzzle: emptyGame
      })
  }
  handleStop = (event)=> {
    while(timeout >= 0){
        clearTimeout(timeout);
        timeout--;
    }
  }
  handleSolve = (event) => {
      console.log("button clicked")
    this.solve(this.state.puzzle);
    console.log(this.state.puzzle)
  };
  handleNew = (event) => {
      this.setState({
          puzzle:this.createSudoku()
      })
  }
  createSudoku() {
    const puzzle = [];
    const data = getSudoku("easy");
    const raw = data.puzzle;
    const sol = data.solution;

    for (let i = 0; i < 9; i++) {
      const list = [];
      for (let j = 0; j < 9; j++) {
        if (raw[i * 9 + j] === "-") {
          list.push(0);
        } else {
          list.push(parseInt(raw[i * 9 + j]));
        }
      }
      puzzle.push(list);
    }
    for (let i = 0; i < 9; i++) {
      const list = [];
      for (let j = 0; j < 9; j++) {
        list.push(parseInt(sol[i * 9 + j]));
      }
      solution.push(list);
    }
    return puzzle;
  }
  fieldSelection(guess, row, col) {
    const board = document.querySelector(".board");
    const selected = board.childNodes[row].childNodes[col];
    selected.focus();
    selected.value = guess;
  }
    solve(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === 0) {
          for (let guess = 1; guess < 10; guess++) {
            timeout = setTimeout (()=>{this.fillCell(row,col,guess)}, TIME +=50);
            if (this.isValid(guess, row, col, grid)) {
            // await this.delay(1000)
              grid[row][col] = guess;
              if (this.solve(grid)) {
                return true;
              }
              grid[row][col] = 0;
              timeout = setTimeout(()=>{this.emptyCell(row, col)},TIME +=50);
            }
          }
          timeout = setTimeout(()=>{this.emptyCell(row, col)},TIME +=50);
          return false;
        }
      }
    }
    console.log("done solving")
    return true;
  }

  isValid(guess, row, col, grid) {
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === guess) {
        return false;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === guess) {
        return false;
      }
    }
    let boxRow = row - (row % 3);
    let boxCol = col - (col % 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === guess) {
          return false;
        }
      }
    }
    // this.correctCell(row, col)
    return true;
  }
  fillCell(row, col, guess) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.focus();
    
    selected.value = guess;
    console.log("fillcell "+ guess + ' '+ row+col)
  }
  
  emptyCell(row,col) {
    const selected =
        document.querySelector(".board").childNodes[row].childNodes[col];
      selected.focus();
      
      selected.value = "";
      console.log("emptyCell "+ row+col)
  }
  render() {
    return (
      <div>
        <div className="board">
          {this.state.puzzle && this.state.puzzle.map((row, index) => (
            <div className="row" key={index}>
              {row.map((col, index) => (
                <input
                  className={col === 0 ? 'empty input': 'number input'} 
                  type="text"
                  value={col === 0 ? "" : col}
                  onChange= {this.checkSol}
                />
              ))}
            </div>
          ))}
        </div>
        <div>
          <button onClick={this.handleSolve}>Solve</button>
          <button onClick={this.handleNew}>New Game</button>
          <button onClick={this.handleClear}>Clear</button>
          <button onClick={this.handleStop}>Stop</button>
        </div>
      </div>
    );
  }
}
export default Board;
