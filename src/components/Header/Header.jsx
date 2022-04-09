import "./Header.scss";
import code from '../../assets/images/code.svg';
import github from '../../assets/images/github.png';
import linkedin from '../../assets/images/linkedIn.svg';

const onHover = (e) => {
  const button = document.querySelector('.contact-btn');
  const list = document.querySelector('.contact-list');
  button.classList.add('deactivate');
  list.classList.add('activate');
}
const onmouseout = (e) => {
  const button = document.querySelector('.contact-btn');
  const list = document.querySelector('.contact-list');
  button.classList.remove('deactivate');
  list.classList.remove('activate');
}

function Header(props) {
  return (
    <div className="container">
      <div className="header">
        <div className="contact" onMouseEnter={onHover} onMouseLeave={onmouseout}>
          <p className="contact-btn" >Contact</p>
          <ul className="contact-list">
            <li className="contact-list__item"><a href="https://github.com/angrajlatake/sudoku-solve-visualizer" target="_blank" rel='noreferrer'><img src={github} alt="github" className="list-img"/></a></li>
            <li className="contact-list__item"><a href="https://www.linkedin.com/in/angrajlatake/" target="_blank" rel='noreferrer'><img src={linkedin} alt="linkedIn" className="list-img list-img-svg"/></a></li>

          </ul>
        </div>
        <div className={props.dev ?"header__title": null}>
          <h1>Sudoku</h1>
        </div>
        <div className="dev-btn" onClick={props.devMode}>
          <img className="dev-img" src={code} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Header;
