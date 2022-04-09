import "./Board.scss";
import { getSudoku } from "sudoku-gen";
import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Field from "../../components/Field/Field";
import Modal from "../../components/Modal/Modal";
import axios from "axios";
var solution = [];
var player = [];
let TIME = 0;
var timeout = 0;
var id = 0;
var timeOutArr=[];
var puzzleCopy = [];
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
    checkComplete: false,
    speed: 100,
    BSpeed: 200,
    topPlayers: [],
    showModal: false,
    time:"",
    speedLimit: null
  };
  /* ---------------------------PLAYER-FUNCTIONS----------*/

  // ---------------GAME-FUNCTIONS-----------------
  //select level of new sudoku game
  setLevel = (level) => {
    this.setState({
      level: level,
    });
    this.handleNew();
  };
  //function that clears all the fields
  handleClear = (event) => {
    this.setState({
      puzzle: emptyGame,
      checkComplete: false,
      runningTimer: false,
    });
  };

  handleNew = (event) => {
    id = 0;
    this.setState({
      puzzle: this.createSudoku(),
      runningTimer: true,
    });
    console.log(solution);
    console.log(player);
  };
  //function that creates new sudoku and converts it into a 2d array
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

  handleSubmit = (event) => {
    console.log("submit clicked");
    console.log(player)
    event.preventDefault();
    if (JSON.stringify(player) === JSON.stringify(solution)) {
      console.log("complete");
      const hours = document.querySelector(".hours").innerText;
      const minutes = document.querySelector(".minutes").innerText;
      const seconds = document.querySelector(".seconds").innerText;
      console.log(hours, minutes, seconds);
      this.setState({
        showModal: true,
        time: `${hours}:${minutes}:${seconds}`,
      })
    }
  }
  componentDidMount() {
    const topFive = axios.get("https://sudokuscoreapi.herokuapp.com/leaderboard");
    topFive
      .then((res) => {
        this.setState({
          topPlayers: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onModalSubmit = (event) => {
    event.preventDefault();
    const name = document.querySelector(".submit-name").value;
    console.log(name)
    const time = this.state.time;
    const data = {
      name: name,
      time: time,
    };
    const post = axios.post("https://sudokuscoreapi.herokuapp.com/leaderboard", data);
    post
      .then((res) => {
        console.log(res);
        this.setState({
          showModal: false,
          topPlayers: res.data,
          puzzle: emptyGame,
          runningTimer: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  showModal =() =>{
    this.setState({
      showModal: !this.state.showModal,
    })
  }
  //function for check button
  checkSol = (event) => {
    this.checkFields(this.state.puzzle);
  };
  //check all the fields and highlight the correct, incorrect and empty fields
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
  //highlight the empty fields
  colorEmptyField(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.classList.add("showEmptyField");
    setTimeout(() => {
      selected.classList.remove("showEmptyField");
    }, 1000);
  }
  //highlight the correct fields
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
  //highlight the incorrect fields
  colorIncorrectField(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.classList.add("incorrectField");
    setTimeout(() => {
      selected.classList.remove("incorrectField");
    }, 1000);
  }
  //checks input for a number and highlights if there are any existing numbers in the same row, column or box
  checkInput = (event) => {
    const field = event.target.value;
    const re = /[1-9]/;
    if (!re.test(field) || field.length >= 2) {
      event.target.value = "";
    } else {
      const index = event.target.dataset.id;
      const col = index % 9;
      const row = (index - col) / 9;
      const number = parseInt(event.target.value);
      this.fillCell(row, col, number);
      player[row][col] = number;
      this.showRepeat(number, row, col, this.state.puzzle);
    }
  };
  //function to show the repeat numbers in the same row, column or box
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
  //function to highlight repeated numbers
  highlight(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.classList.add("highlight");
    setTimeout(() => {
      selected.classList.remove("highlight");
    }, 1000);
  }


  /* ---------------------------DEV-FUNCTIONS----------*/
  checkComplete() {
    console.log(this.state.puzzle);
    if (JSON.stringify(solution) === JSON.stringify(this.state.puzzle)) {
      this.setState({
        checkComplete: true,
        runningTimer: false,
        puzzle: this.state.puzzle,
      });
      console.log("complete sudoku");
    }
    while (timeout >= 0) {
      clearTimeout(timeout);
      timeout--;
    }
  }
  changeDevMode = (event) => {
    this.setState({
      devMode: !this.state.devMode,
    });
  };
  setAlgo = (algo) => {
    this.setState({
      Algorithm: algo,
    });
    console.log(this.state.Algorithm);
  };
  setSpeed = (speed) => {
    this.setState({
      speedLimit: speed,
    });
  };
  solve(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === 0) {
          for (let guess = 1; guess < 10; guess++) {
            timeout = setTimeout(() => {
              this.fillCell(row, col, guess);
            }, (TIME += this.state.speed));
            timeOutArr.push(timeout);
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
              timeOutArr.push(timeout);
            }
          }
          timeout = setTimeout(() => {
            this.emptyCell(row, col);
          }, (TIME += this.state.speed));
          timeOutArr.push(timeout);
          return false;
        }
      }
    }
    timeout = setTimeout(() => {
      this.checkComplete();
    }, (TIME += this.state.speed));
    timeOutArr.push(timeout);
    console.log(timeout)
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
  }

  emptyCell(row, col) {
    const selected =
      document.querySelector(".board").childNodes[row].childNodes[col];
    selected.focus();

    selected.value = "";
  }
  handleStop = (event) => {
    console.log(timeOutArr)
    // while (timeout >= 0) {
    //   clearTimeout(timeout);
    //   timeout--;
    // }
    timeOutArr.forEach((item) => {
      clearTimeout(item);

    })
    timeOutArr = [];
    timeout = 0;
    this.handleReset();
  };
  handleSolve = (event) => {
    console.log(this.state.speed)
    TIME = 0
    if (this.state.Algorithm === "DFS") {
      this.solve(this.state.puzzle);
    } else if (this.state.Algorithm === "BFS") {
      this.heuristicSolver(this.state.puzzle);
    }
  };

  heuristicBuilder= (grid) => {
    const mainList = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (grid[row][col] === 0) {
          this.hIsValid(row, col, grid, list, mainList);
        }
      }
    }
    mainList.sort((a, b) => {
      return a.list.length - b.list.length;
    });
    return mainList;
  }
  heuristicSolver =(grid) => {
    const mainList = this.heuristicBuilder(grid);
    for (let i = 0; i < mainList.length; i++) {
      const item = mainList[i];
      const row = item.row;
      const col = item.col;
      const list = item.list;
      if (grid[row][col] === 0) {
        for (let j = 0; j < list.length; j++) {
          const guess = list[j];
          timeout = setTimeout(() => {
            this.fillCell(row, col, guess);
          }, (TIME += this.state.BSpeed));
          timeOutArr.push(timeout);
          if (this.isValid(guess, row, col, grid)) {
            grid[row][col] = guess;
            this.removeItem(mainList, item);

            if (this.heuristicSolver(grid)) {
              return true;
            }
            mainList.unshift(item);
            grid[row][col] = 0;
            timeout = setTimeout(() => {
              this.emptyCell(row, col);
            }, (TIME += this.state.BSpeed));
            timeOutArr.push(timeout);
          }
        }
      }

      timeout = setTimeout(() => {
        this.emptyCell(row, col);
      }, (TIME += this.state.BSpeed));
      timeOutArr.push(timeout);
      return false;
    }
    timeout = setTimeout(() => {
      this.checkComplete();
    }, (TIME += this.state.BSpeed));
    timeOutArr.push(timeout);
    return true;
  }
  hIsValid(row, col, grid, list, mainList) {
    for (let i = 0; i < 9; i++) {
      this.removeItem(list, grid[i][col]);
    }
    for (let i = 0; i < 9; i++) {
      this.removeItem(list, grid[row][i]);
    }
    let boxRow = row - (row % 3);
    let boxCol = col - (col % 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        this.removeItem(list, grid[i][j]);
      }
    }
    mainList.push({ row: row, col: col, list: list });
  }
  removeItem(list, item) {
    const index = list.indexOf(item);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }
  handleReset =(event) => {
    const resetBoard = [];
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
    this.setState({
      puzzle: resetBoard,
      checkComplete: false,
    });
  }
  refresh =() =>{
    window.location.reload(false)
  }
  render() {
    return (
      <>
        <div className={this.state.devMode ? "game-dev" : "game"}>
          <Header devMode={this.changeDevMode} dev = {this.state.devMode}/>
          {this.state.devMode ? (
            <Navbar
              dev={this.state.devMode}
              algo={this.setAlgo}
              start={this.handleNew}
              clear={this.handleStop}
              solve={this.handleSolve}
              setSpeed={this.setSpeed}
              timeFunction={this.setTime}
              complete={this.state.checkComplete}
              reset={this.handleReset}
              speed={timeout}
            />
          ) : (
            <Navbar
              dev={this.state.devMode}
              level={this.setLevel}
              start={this.handleNew}
              clear={this.handleClear}
              check={this.checkSol}
              timer={this.state.runningTimer}
              submit={this.handleSubmit}
            />
          )}
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
          {!this.state.devMode ? (
            <div className="top-players">
              <h2>Top Players</h2>
              <div className="player-list">
                {this.state.topPlayers.map((player, index) => {
                  return (
                    <div className="player" key={index}>
                      <div className="player-name">{player.name}</div>
                      <div className="player-time">{player.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {this.state.showModal ? <Modal time ={this.state.time} onSubmit ={this.onModalSubmit} close={this.showModal}/>:null}
        </div>
      </>
    );
  }
}
export default Board;
