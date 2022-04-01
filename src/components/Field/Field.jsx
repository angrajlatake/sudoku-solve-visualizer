
function Field({col, checkInput, id, checkSol}) {
  return (
    <input
    className={col === 0 ? "empty input" : "number input"}
    type="text"
    value={col === 0 ? "" : col}
    onChange={checkInput}
    data-id = {id}
    onClick={checkSol}
  />
  );
}

export default Field;
