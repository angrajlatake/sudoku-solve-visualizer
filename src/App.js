import Header from "./components/Header/Header.jsx";
import "./App.scss";

import Board from "./components/Board/Board.jsx";
import Navbar from './components/Navbar/Navbar.jsx'
function App() {
  return (
    <div className="App">
      <div>
        <Header />
        <Navbar/>
      </div>
      <div>
        <Board />
      </div>
    </div>
  );
}

export default App;
