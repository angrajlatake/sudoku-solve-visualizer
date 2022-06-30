import "./Navbar.scss";
import Timer from "../Timer/Timer";
import arrow from "../../assets/images/arrow.svg";
function Navbar(props) {
  return (
    <>
      {props.dev ? (
        <div className="nav">
          <ul className="list">
            <li className="list__item">
              <div className="select">
                <select
                  className="select algo"
                  name="algo"
                  id="algo"
                  onChange={(event) => {
                    props.algo(event.target.value);
                  }}
                >
                  <option className="option" selected disabled>
                    Algorithm
                  </option>
                  <option className="option" value="DFS">
                    DFS
                  </option>
                  <option className="option" value="BFS">
                    BFS
                  </option>
                </select>
              </div>
            </li>
            <li className="list__item">
              <select
                className="select speed"
                name="speed"
                id="speed"
                onChange={(event) => {
                  props.setSpeed(parseInt(event.target.value));
                }}
              >
                <option className="option">Speed</option>
                <option className="option" value="10">
                  Fast
                </option>
                <option className="option" value="50">
                  Medium
                </option>
                <option className="option" value="100">
                  Slow
                </option>
              </select>
            </li>

            <li className="list__item" onClick={props.solve}>
              Visualize
            </li>

            <li className="list__item" onClick={props.start}>
              New
            </li>
            {!props.complete ? (
              <li className="list__item" onClick={props.clear}>
                Stop
              </li>
            ) : (
              <li className="list__item" onClick={props.reset}>
                Reset
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="nav">
          <ul className="list">
            <li className="list__item">
              <div className="select">
                <select
                  className="select level"
                  name="level"
                  id="level"
                  onChange={(event) => {
                    props.level(event.target.value);
                  }}
                >
                  <option className="option" value="easy">
                    Easy
                  </option>
                  <option className="option" value="medium">
                    Medium
                  </option>
                  <option className="option" value="hard">
                    Hard
                  </option>
                </select>
                <img src={arrow} className="arrow" alt="" />
              </div>
            </li>
            <li className="list__item" onClick={props.clear}>
              Clear
            </li>

            {props.timer ? (
              <li className="list__item time">
                <Timer timeFunction={props.timeFunction} />
              </li>
            ) : (
              <li className="list__item" onClick={props.start}>
                Start
              </li>
            )}
            <li className="list__item" onClick={props.check}>
              Check
            </li>
            <li className="list__item" onClick={props.submit}>
              Submit
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
