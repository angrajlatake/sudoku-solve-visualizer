
function Field({col, checkInput, id, checkSol}) {
  return (
    <input
    className={col === 0 ? "empty input" : "number input"}
    type="text"
    defaultValue={col === 0 ? null : col}
    onChange={checkInput}
    data-id = {id}
    disabled ={col !== 0 ? true : false}
  />
  );
}

export default Field;
