import React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import accounting from "accounting";

import "./LineItems.css";

const LineItems = props => {
  return (
    <tr className="table_row">
      <th scope="row" className="table_header">{props.rowNumber}</th>
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
        <InputGroup>
          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
          <Input
            value={props.rate}
            type="number"
            name="rate"
            id="rate"
            placeholder="$ 0.00"
            onChange={e => {
              props.handleLineItemChange(e, props.rowNumber - 1, "rate");
            }}
          />
        </InputGroup>
      </td>
      <td className="row_amount"> 
        <Input
          value={accounting.formatMoney(props.quantity * props.rate)}
          type="amount"
          name="row_amount"
          id="row_amount"
          placeholder="0.00"
          disabled
        />
      </td>
      {/* <td className="row_amount">${props.quantity * props.rate} </td> */}
    </tr>
  );
};

export default LineItems;
