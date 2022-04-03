import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import Board from "./pages/Board/Board";
import DevBoard from './pages/DevBoard/DevBoard'

function App() {


  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path ='/' exact component={Board}/>
          <Route path ='/dev' component={DevBoard}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
