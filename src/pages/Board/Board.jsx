import "./Board.scss";
import { getSudoku } from "sudoku-gen";
import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Field from "../../components/Field/Field";
var solution = [];
var player = [];
let TIME = 0;
var timeout = 0;
var id = 0;
var puzzleCopy =[]
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
    puzzleCopy: null,
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
    this.checkComplete()
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
    this.checkComplete()
    const field = event.target.value;
    const re = /[1-9]/;
    if (!re.test(field) || field.length >= 2) {
      event.target.value = "";
      this.checkComplete() 
    } else {
      console.log('checking complete')
      this.checkComplete()
      const index = event.target.dataset.id;
      const col = index % 9;
      const row = (index - col) / 9;
      const number = parseInt(event.target.value);
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
    puzzleCopy = raw;
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
  checkComplete () {
    if (JSON.stringify(solution) === JSON.stringify(this.state.puzzle)){
      this.setState({
        checkComplete: !this.state.checkComplete,
        runningTimer:false,
        puzzle: this.state.puzzle
      })
      console.log("complete sudoku")
    } else{
      console.log('false')
    }
  }
  setTime(time){
    this.setState({
      time: time
    })
  }
  /* ---------------------------DEV-FUNCTIONS----------*/
  changeDevMode = (event) => {
    this.setState({
      devMode: !this.state.devMode,
    });
  }
  setAlgo = (algo) => {
    this.setState({
      Algorithm: algo,
    });
    console.log(this.state.Algorithm)
  };
  setSpeed = (speed) => {
      this.setState ({
        time: speed
      })
  }
  solve(grid) {
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
    timeout = setTimeout(() => {
      this.checkComplete();
    }, (TIME += this.state.time));
    return true;
  }
  solveByHeuristic(grid){
    const t = performance.now();
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

    if (this.heuristicHelper(mainList, grid)){
      return true
    }
    console.log(performance.now() - t);
  }
  heuristicHelper(mainList, grid){

    for (let i = 0; i < mainList.length; i++){
      const item = mainList[i]
      const row = item.row;
      const col = item.col;
      const list = item.list
      if (grid[row][col]===0){
        for (let j = 0; j < list.length; j++){
          const guess = list[j];
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
    this.handleReset()
  };
  handleSolve = (event) => {
    if (this.state.Algorithm === 'DFS'){
      this.solve(this.state.puzzle)
    }else if(this.state.Algorithm === 'BFS'){
      this.heuristicSolver(this.state.puzzle)
    }
  };

  heuristicBuilder(grid){
    const mainList = [];
    for (let row = 0; row < grid.length; row++){
      for (let col = 0; col < grid.length; col++) {
        const list = [1,2,3,4,5,6,7,8,9]
        if (grid[row][col] === 0) {
          this.hIsValid(row, col, grid, list, mainList)
        }
      }
    }
    mainList.sort((a,b) =>{
      return a.list.length - b.list.length
    })
    return mainList
  }
  heuristicSolver(grid){
    console.log('starting heuristic solver')
    const mainList = this.heuristicBuilder(grid)
    for (let i = 0; i < mainList.length; i++){
      const item = mainList[i]
      const row = item.row;
      const col = item.col;
      const list = item.list
      if (grid[row][col]===0){
        for (let j = 0; j < list.length; j++){
          const guess = list[j];
          timeout = setTimeout(() => {
            this.fillCell(row, col, guess);
          }, (TIME += this.state.time));
          if (this.isValid(guess, row, col, grid)){
            grid[row][col] = guess;
            this.removeItem(mainList, item)
  
            if (this.heuristicSolver(grid)){
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
  timeout = setTimeout(() => {
    this.checkComplete();
  }, (TIME += this.state.time));
  return true
}
handleReset(event) {
  const resetBoard =[]
  for (let i = 0; i < 9; i++) {
    const list = [];
    for (let j = 0; j < 9; j++) {
      if (puzzleCopy[i * 9 + j] === "-") {
        list.push(0);
      } else {
        list.push(parseInt(puzzleCopy[i * 9 + j]));
      }
    }
    resetBoard.push(list);

  }
  console.log(puzzleCopy)
}
  
  render() {
    return (
      <div className={this.state.devMode ? "game-dev" : "game"}>
        <Header devMode ={this.changeDevMode}/>
        {this.state.devMode ? <Navbar
          dev={this.state.devMode}
          algo={this.setAlgo}
          start={this.handleNew}
          clear={this.handleStop}
          solve={this.handleSolve}
          setTime={this.setSpeed}
          timeFunction={this.setTime}
          complete ={this.state.checkComplete}
          reset ={this.handleReset}
          speed ={timeout}
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
