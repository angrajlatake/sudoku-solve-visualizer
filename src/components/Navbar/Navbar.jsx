import "./Navbar.scss";
import Timer from "../Timer/Timer";
function Navbar({ dev, level, start, clear, check, timer }) {
  return (
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
              <option className="option" value="easy">Easy</option>
              <option className="option" value="medium">Medium</option>
              <option className="option" value="hard">Hard</option>
            </select>
          </div>
        </li>
        <li className="list__item" onClick={clear}>
          Clear
        </li>

        {timer ? (
          <li className="list__item">
            <Timer />
          </li>
        ) : (
          <li className="list__item" onClick={start}>
            Start
          </li>
        )}
        <li className="list__item" onClick={check}>
          Check
        </li>
        <li className="list__item" onClick={clear}>
          Submit
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
