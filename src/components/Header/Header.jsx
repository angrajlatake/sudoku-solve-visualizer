import "./Header.scss";
import code from '../../assets/images/code.svg';
function Header(props) {
  return (
    <div className="header">
      <div className="header__title">
        <h1>Sudoku</h1>
      </div>
      <div className="dev-btn" onClick={props.devMode}>
        <img className="dev-img" src={code} alt="" />
      </div>
    </div>
  );
}

export default Header;
