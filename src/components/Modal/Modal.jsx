import './Modal.scss';
function Modal(props) {
    return ( 
        <div className="modal">

            <div className="modal-container">
            <div className="close" onClick={props.close}>X</div>
                <h2 className='modal-h2'>
                    You have completed the game in {props.time}
                </h2>
                <form className='form' action="">
                    <input type="text" name="player-name" className="submit-name" placeholder="Enter your name" onChange={props.changeName}/>
                    <button className='form-button' onClick={props.onSubmit}>Submit</button>
                </form>
            </div>
        </div>
     );
}

export default Modal;