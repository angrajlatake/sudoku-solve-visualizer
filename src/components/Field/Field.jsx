
function Field({col, checkInput, id, checkSol}) {
  return (
    <input
    className={col === 0 ? "empty input" : "number input"}
    type="text"
    defaultValue={col === 0 ? null : col}
    onChange={checkInput}
    data-id = {id}
  />
  );
}

export default Field;
