import "./Header.scss";
import code from '../../assets/images/code.svg';
function Header() {
  return (
    <div className="header">
      <div className="header__title">
        <h1>Sudoku</h1>
      </div>
      <div className="header__toggle">
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}

export default Header;
