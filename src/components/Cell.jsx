import React from "react";

export default function Cell(props) {
  return (
    <div
      key={props.index}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
      className={props.className}
    >
      {props.children}
    </div>
  );
}
