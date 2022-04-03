import "./Board.scss";
import { getSudoku } from "sudoku-gen";
import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Field from "../../components/Field/Field";
var solution = [];
var player = [];
let TIME = 1000;
var timeout = 0;
var id = 0;
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
    lastField: 0,
    checkComplete: false,
    time: 100,
  };
  /* ---------------------------PLAYER-FUNCTIONS----------*/
  setLevel = (level) => {
    this.setState({
      level: level,
    });
    this.handleNew();
  };
  checkSol = (event) => {
    this.checkFields(this.state.puzzle);
  };
  checkFields = (grid) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === 0) {
          this.colorEmptyField(row, col);
        } else if (
          grid[row][col] !== 0 &&
          grid[row][col] === solution[row][col]
        ) {
          this.colorCorrectField(row, col);
        } else if (grid[row][col] !== solution[row][col]) {
          this.colorIncorrectField(row, col);
        }
      }
    }
  };
  colorEmptyField(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.classList.add("showEmptyField");
    setTimeout(() => {
      selected.classList.remove("showEmptyField");
    }, 1000);
  }
  colorCorrectField(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    if (!selected.classList.contains("number")) {
      selected.classList.add("correctField");
      setTimeout(() => {
        selected.classList.remove("correctField");
      }, 1000);
    }
  }
  colorIncorrectField(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.classList.add("incorrectField");
    setTimeout(() => {
      selected.classList.remove("incorrectField");
    }, 1000);
  }

  checkInput = (event) => {
    this.checkComplete(this.state.puzzle)
    const field = event.target.value;
    const re = /[1-9]/;
    if (!re.test(field) || field.length >= 2) {
      event.target.value = "";
      this.checkComplete(this.state.puzzle) 
    } else {
      this.checkComplete(this.state.puzzle)
      const index = event.target.dataset.id;
      const col = index % 9;
      const row = (index - col) / 9;
      const number = parseInt(event.target.value);
      player[row][col] = number;
      this.fillCell(row, col, number);
      this.showRepeat(number, row, col, this.state.puzzle);
    }
  };
  showRepeat(number, row, col, grid) {
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === number && i !== row) {
        this.highlight(i, col);
      }
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === number && i !== col) {
        this.highlight(row, i);
      }
    }
    let boxRow = row - (row % 3);
    let boxCol = col - (col % 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === number && i !== row && j !== col) {
          this.highlight(i, j);
        }
      }
    }
  }
  highlight(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.classList.add("highlight");
    setTimeout(() => {
      selected.classList.remove("highlight");
    }, 1000);
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
      runningTimer: true,
    });
    console.log(solution);
  };
  createSudoku() {
    const puzzle = [];
    solution = [];
    const data = getSudoku(this.state.level);

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
      player.push(list);
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
  checkComplete (grid) {
    if (JSON.stringify(solution) === JSON.stringify(grid)){
      this.setState({
        checkComplete: true,
        runningTimer:false
      })
      console.log("complete sudoku")
    }
  }
  setTime(time){
    this.setState({
      time: time
    })
  }
  /* ---------------------------DEV-FUNCTIONS----------*/
  solve(grid) {
    const start = Date.now();
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === 0) {
          for (let guess = 1; guess < 10; guess++) {
            timeout = setTimeout(() => {
              this.fillCell(row, col, guess);
            }, (TIME += this.state.time));
            if (this.isValid(guess, row, col, grid)) {
              // await this.delay(1000)
              grid[row][col] = guess;
              if (this.solve(grid)) {
                return true;
              }
              grid[row][col] = 0;
              timeout = setTimeout(() => {
                this.emptyCell(row, col);
              }, (TIME += this.state.time));
            }
          }
          timeout = setTimeout(() => {
            this.emptyCell(row, col);
          }, (TIME += this.state.time));
          return false;
        }
      }
    }
    console.log(Date.now() - start);
    return true;
  }
  solveByHeuristic(grid){
    const mainList = [];
    for (let row = 0; row < grid.length; row++){
      for (let col = 0; col < grid.length; col++) {
        const list = [1,2,3,4,5,6,7,8,9]
        if (grid[row][col] === 0) {
          this.hIsValid(row, col, grid, list, mainList)
        }
      }
    }
    console.log("sorting list")
    mainList.sort((a,b) =>{
      return a.list.length - b.list.length
    })
    console.log(mainList)

    if (this.heuristicHelper(mainList, grid)){
      return true
    }
  }
  heuristicHelper(mainList, grid){
    const start = Date.now()
    for (let i = 0; i < mainList.length; i++){

      const item = mainList[i]
      const row = item.row;
      const col = item.col;
      const list = item.list
      if (grid[row][col]===0){
        for (let j = 0; j < list.length; j++){
          const guess = list[j];
          console.log(guess)
          timeout = setTimeout(() => {
            this.fillCell(row, col, guess);
          }, (TIME += this.state.time));
          if (this.isValid(guess, row, col, grid)){
            grid[row][col] = guess;
            this.removeItem(mainList, item)
  
            if (this.heuristicHelper(mainList,grid)){
              return true
            }
            mainList.unshift(item)
            grid[row][col] = 0; 
            timeout = setTimeout(() => {
              this.emptyCell(row, col);
            }, (TIME += this.state.time));
          }
        } 
      }

      timeout = setTimeout(() => {
        this.emptyCell(row, col);
      }, (TIME += this.state.time));
      return false 
  }
  console.log(grid)
  console.log(solution)
  console.log(JSON.stringify(grid)=== JSON.stringify(solution))
  console.log(Date.now() - start)
  return true
}

  hIsValid(row, col, grid, list, mainList){
    for (let i = 0; i < 9; i++) {
      this.removeItem(list, grid[i][col])
    }
    for (let i = 0; i < 9; i++) {
      this.removeItem(list, grid[row][i])
    }
    let boxRow = row - (row % 3);
    let boxCol = col - (col % 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        this.removeItem(list, grid[i][j])
      }
    }
    mainList.push({row:row, col:col, list:list})
    console.log(mainList)
  }
  removeItem(list, item){
    const index = list.indexOf(item);
    if (index !== -1) {
      list.splice(index, 1);
    }
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
  }

  emptyCell(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.focus();

    selected.value = "";
  }
  handleStop = (event) => {
    while (timeout >= 0) {
      clearTimeout(timeout);
      timeout--;
    }
  };
  handleSolve = (event) => {
    this.solve(this.state.puzzle);
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
          timeFunction={this.setTime}
        />
        <div className="board">
          {this.state.puzzle &&
            this.state.puzzle.map((row, index) => (
              <div className="row" key={index}>
                {row.map((col, index) => (
                  <Field
                    col={col}
                    checkInput={this.checkInput}
                    id={id++}
                    checkSol={this.checkSol}
                    key={uuidv4()}
                  />
                ))}
              </div>
            ))}
        </div>
        <button onClick={()=>{this.solveByHeuristic(this.state.puzzle)}}>Hsolve</button>
        <button onClick={()=>{this.solve(this.state.puzzle)}}>Bsolve</button>
      </div>
    );
  }
}
export default Board;
