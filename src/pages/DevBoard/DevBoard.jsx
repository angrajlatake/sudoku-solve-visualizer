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
    puzzleCopy: emptyGame,
    devMode: true,
    Algorithm: "DFS",
    speed: 0
  };

  setLevel = (algo) => {
    this.setState({
      Algorithm: algo,
    });
    console.log(this.state.Algorithm)

  };
  setSpeed = (speed) => {
      this.setState ({
        speed: speed
      })
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
    });
    this.setState({
      puzzleCopy: this.state.puzzle
    })
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

  solve(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === 0) {
          for (let guess = 1; guess < 10; guess++) {
            timeout = setTimeout(() => {
              this.fillCell(row, col, guess);
            }, (TIME += this.state.speed));
            if (this.isValid(guess, row, col, grid)) {
              // await this.delay(1000)
              grid[row][col] = guess;
              if (this.solve(grid)) {
                return true;
              }
              grid[row][col] = 0;
              timeout = setTimeout(() => {
                this.emptyCell(row, col);
              }, (TIME += this.state.speed));
            }
          }
          timeout = setTimeout(() => {
            this.emptyCell(row, col);
          }, (TIME += this.state.speed));
          return false;
        }
      }
    }
    console.log('done')
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
    console.log(mainList)
    mainList.sort((a,b) =>{
      return a.list.length - b.list.length
    })
    for (let i = 0; i < mainList.length; i++){

      const item = mainList[i]
      const row = item.row;
      const col = item.col;
      const list = item.list
      console.log(item, i)
      for (let j = 0; j < list.length; j++){
        const guess = list[j];
        console.log(guess)
        timeout = setTimeout(() => {
          this.fillCell(row, col, guess);
        }, (TIME += this.state.speed));
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
          }, (TIME += this.state.speed));
        }
      }
      timeout = setTimeout(() => {
        this.emptyCell(row, col);
      }, (TIME += this.state.speed));
      return false 
  }
  console.log(grid)
  console.log(solution)
  console.log(JSON.stringify(grid)=== JSON.stringify(solution))
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
    this.state.Algorithm === "DFS" ? this.solve(this.state.puzzle): this.solveByHeuristic(this.state.puzzle);

  };
  render() {
    return (
      <div>
        <Header />
        {this.state.devMode ? <Navbar
          dev={this.state.devMode}
          level={this.setLevel}
          start={this.handleNew}
          clear={this.handleStop}
          check={this.handleSolve}
          timer={this.setSpeed}
          timeFunction={this.setTime}
        /> : <Navbar
        dev={this.state.devMode}
        level={this.setLevel}
        start={this.handleNew}
        clear={this.handleClear}
        check={this.checkSol}
        timer={this.state.runningTimer}
        timeFunction={this.setTime}
      />}

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
      </div>
    );
  }
}
export default Board;
