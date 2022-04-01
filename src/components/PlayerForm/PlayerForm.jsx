import "./PlayerForm.scss";

function PlayerForm(props) {
  return (
    <form
      className="form"
      onSubmit={(event) => {
          event.preventDefault();
        props.updateName(event.target.name.value);
        console.log(event.target.name.value)
      }}
    >
      <label htmlFor="name" className="form__label">
        Name
        <input type="text" name="name" id="name" />
      </label>
      <button type="submit" className=" label-btn btn">
        Play
      </button>
    </form>
  );
}

export default PlayerForm;
