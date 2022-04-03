import "./Navbar.scss";
import Timer from "../Timer/Timer";
function Navbar({ dev, level, start, clear, check, timer, timeFunction }) {
  return (
    <>
      {dev ? (
        <div className="nav">
          <ul className="list">
            <li className="list__item">
              <div className="select">
                <select
                  className="select"
                  name="level"
                  id="level"
                  onChange={(event) => {
                    level(event.target.value);
                  }}
                >
                  <option className="option" >
                    Algorithm
                  </option>
                  <option className="option" value="DFS">
                    Depth first Search
                  </option>
                  <option className="option" value="BFS">
                    Best First Search
                  </option>
                </select>
              </div>
            </li>
            <li className="list__item">
            <select
                  className="select"
                  name="speed"
                  id="speed"
                  onChange={(event) => {
                    timer(event.target.value);
                    console.log(event.target.value)
                  }}
                >
                  <option className="option" >
                    Speed
                  </option>
                  <option className="option" value="10">
                    Fast
                  </option>
                  <option className="option" value="50">
                    Slow
                  </option>
                  <option className="option" value="100">
                    Extra Slow
                  </option>
                </select>
            </li>

            <li className="list__item" onClick={check}>
              Visualize
            </li>

            <li className="list__item" onClick={start}>
              New
            </li>
            <li className="list__item" onClick={clear}>
              Stop
            </li>
          </ul>
        </div>
      ) : (
        <div className="nav">
          <ul className="list">
            <li className="list__item">
              <div className="select">
                <select
                  className="select"
                  name="level"
                  id="level"
                  onChange={(event) => {
                    level(event.target.value);
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
              </div>
            </li>
            <li className="list__item" onClick={clear}>
              Clear
            </li>

            {timer ? (
              <li className="list__item">
                <Timer timeFunction={timeFunction} />
              </li>
            ) : (
              <li className="list__item" onClick={start}>
                Start
              </li>
            )}
            <li className="list__item" onClick={check}>
              Check
            </li>
            <li className="list__item">Submit</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
