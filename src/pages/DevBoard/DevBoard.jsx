import "./Board.scss";
import { getSudoku } from "sudoku-gen";
import React, { Component } from "react";
import { v4 as uuidv4 } from 'uuid';
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import  Field from '../../components/Field/Field'
const solution = [];
let TIME = 1000;
var timeout = 0;
var id = 0
const emptyGame = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

class Board extends Component {
  state = {
    puzzle: emptyGame,
    devMode: false,
    level: "easy",
    runningTimer: false,
    lastField: 0
  };
/* ---------------------------PLAYER-FUNCTIONS----------*/
  setLevel =(level) => {
    this.setState({
      level:level
    })
  }
  checkSol = (event) => {
    console.log(event.target)
  };
  checkInput =(event) => {
    const field = event.target.value
    const re = /[1-9]/;
    if (!re.test(field) || field.length >= 2 ){
      console.log('checking if')
      event.target.value = ""
    } else {
      console.log('getting else')
      const index = event.target.dataset.id
      const col = index % 9
      const row = (index - col)/9
      const number = parseInt(event.target.value)
      id = 0 //had to add before the state updates, can be removed if can be figured out the solution
      const puzzle = this.state.puzzle
      console.log(this.state.puzzle)
      puzzle[row][col] = number
      this.setState({
        puzzle:puzzle
      })
      console.log (index, col, row)
      this.showRepeat(number, row, col, this.state.puzzle)
      this.setState({
        lastField : index
      });
    }
  }
  showRepeat(number, row, col, grid){
    console.log('calling repeat')
    for (let i = 0; i < 9; i++) {
      console.log(grid[i][col])
      if (grid[i][col] === number && i !== row) {
        console.log("highlight1")
        this.highlight(i, col);
      }
    }
    for (let i = 0; i < 9; i++) {
      console.log(grid[row][i])
      if (grid[row][i] === number && i !== col ) {
        console.log("highlight2")
        this.highlight(row, i);
      }
    }
    let boxRow = row - (row % 3);
    let boxCol = col - (col % 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === number && i !== row && j !== col) {
          console.log("highlight3")
          this.highlight(i, j);
        }
      }
    }
  }
  highlight(row, col) {
    console.log(row, col)
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
      selected.classList.add("highlight")
      setTimeout(()=>{selected.classList.remove('highlight')}, 1000)
  }
  handleClear = (event) => {
    this.setState({
      puzzle: emptyGame,
    });
  };

  handleNew = (event) => {
    id = 0;
    this.setState({
      puzzle: this.createSudoku(),
      runningTimer: true
    });
    console.log(solution)

  };
  createSudoku() {
    const puzzle = [];
    const data = getSudoku(this.state.level);

    console.log(this.state.level)
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

/* ---------------------------DEV-FUNCTIONS----------*/
  solve(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === 0) {
          for (let guess = 1; guess < 10; guess++) {
            timeout = setTimeout(() => {
              this.fillCell(row, col, guess);
            }, (TIME += 50));
            if (this.isValid(guess, row, col, grid)) {
              // await this.delay(1000)
              grid[row][col] = guess;
              if (this.solve(grid)) {
                return true;
              }
              grid[row][col] = 0;
              timeout = setTimeout(() => {
                this.emptyCell(row, col);
              }, (TIME += 50));
            }
          }
          timeout = setTimeout(() => {
            this.emptyCell(row, col);
          }, (TIME += 50));
          return false;
        }
      }
    }
    console.log("done solving");
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
    console.log("fillcell " + guess + " " + row + col);
  }

  emptyCell(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.focus();

    selected.value = "";
    console.log("emptyCell " + row + col);
  }
  handleStop = (event) => {
    while (timeout >= 0) {
      clearTimeout(timeout);
      timeout--;
    }
  };
  handleSolve = (event) => {
    console.log("button clicked");
    this.solve(this.state.puzzle);
    console.log(this.state.puzzle);
  };
  render() {

    return (
      <div>
        <Header />
        <Navbar
          dev={this.state.devMode}
          level={this.setLevel}
          start={this.handleNew}
          clear={this.handleClear}
          check={this.checkSol}
          timer={this.state.runningTimer}
        />
        <div className="board">
          {this.state.puzzle &&
            this.state.puzzle.map((row, index) => (
              <div className="row" key={index}>
                {row.map((col, index) => (
                  <Field col= {col} checkInput={this.checkInput} id ={id++} checkSol = {this.checkSol} key={uuidv4()} />
                  // <input
                  //   className={col === 0 ? "empty input" : "number input"}
                  //   type="text"
                  //   defaultValue={col === 0 ? "" : col}
                  //   onChange={this.checkInput}
                  //   key={uuidv4()}
                  //   data-id = {id++}
                  //   onClick={this.checkSol}
                  // />
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  }
}
export default Board;
