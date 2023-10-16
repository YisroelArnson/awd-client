import { useState, useEffect } from "react";
function LinenInput(props) {
  const [select, setSelect] = useState(props.linen.unique_id);
  const [count, setCount] = useState(props.linen.count);
  const onSelect = (event) => {
    setSelect(event.target.value);
  };
  const onCountChange = (event) => {
    setCount(event.target.value);
  };

  useEffect(() => {
    props.updateLinenInput(props.index, select, count);
  }, [select, count]);

  return (
    <div index={props.index}>
      <select onChange={(event) => onSelect(event)}>
        <option value={select}>{props.linen.unique_id}</option>
        {props.linenList?.slice(1).map((option, index) => (
          <option key={index} value={option[1]}>
            {option[0]}
          </option>
        ))}
      </select>
      <input
        index={props.index}
        value={count}
        onChange={(event) => onCountChange(event)}
        className="linen-input"
      ></input>
    </div>
  );
}

export default LinenInput;
