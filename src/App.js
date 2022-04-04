import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import Board from "./pages/Board/Board";

function App() {


  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path ='/' exact component={Board}/>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
