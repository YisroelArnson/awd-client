import React from "react";

export default function CheckBox(props) {
  return (
    <div className="check-box-container">
      <div
        onClick={() => {
          props.onChangeFunction({
            target: { name: props.attribute_id, value: !props.checked },
          });
        }}
        className={props.checked ? "check-box-box checked" : "check-box-box"}
      ></div>
      <h3 className="check-box-title">{props.title}</h3>
    </div>
  );
}
