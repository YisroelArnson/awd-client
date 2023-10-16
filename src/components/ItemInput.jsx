import { useState, useEffect } from "react";
function ItemInput(props) {
  const [itemName, setItemName] = useState(props.item.item_name);
  const [count, setCount] = useState(props.item.count);
  const [price, setPrice] = useState(props.item.price);
  const onItemNameChange = (event) => {
    setItemName(event.target.value);
  };

  const onCountChange = (event) => {
    setCount(event.target.value);
  };

  const onPriceChange = (event) => {
    setPrice(event.target.value);
  };

  useEffect(() => {
    props.updateItemInput(props.index, itemName, count, price);
  }, [itemName, count, price]);
  //empty field for name
  //amount: default 1
  //Cost per item
  return (
    <div index={props.index}>
      {/* Name of item */}
      <input
        index={props.index}
        value={itemName}
        onChange={(event) => onItemNameChange(event)}
        className="item-input"
      ></input>

      {/* Count */}
      <input
        index={props.index}
        value={count}
        onChange={(event) => onCountChange(event)}
        className="item-input"
      ></input>

      {/* Price */}
      <input
        index={props.index}
        value={price}
        onChange={(event) => onPriceChange(event)}
        className="item-input"
      ></input>
    </div>
  );
}

export default ItemInput;
