import React from "react";
import { Input } from "reactstrap";

const LineItems = props => {
  return (
    <tr>
      <th scope="row">{props.rowNumber}</th>
      <td>
        <Input
          value={props.item}
          type="text"
          name="item"
          id="item"
          placeholder="Add Item Here"
          onChange={e => {
            props.handleLineItemChange(e, props.rowNumber - 1, "item");
          }}
        />
      </td>
      <td>
        <Input
          value={props.quantity}
          type="number"
          name="quantity"
          id="quantity"
          placeholder="1"
          onChange={e => {
            props.handleLineItemChange(e, props.rowNumber - 1, "quantity");
          }}
        />
      </td>
      <td>
        <Input
          value={props.rate}
          type="currency"
          name="rate"
          id="rate"
          placeholder="$ 0.00"
          onChange={e => {
            props.handleLineItemChange(e, props.rowNumber - 1, "rate");
          }}
        />
      </td>
      <td>${props.quantity * props.rate} </td>
    </tr>
  );
};

export default LineItems;
