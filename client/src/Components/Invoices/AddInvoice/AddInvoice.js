import React from "react";
import { Link } from "react-router-dom";

const AddInvoice = () => {
  return (
    <div className="create-new-invoice">
      <p> New Invoice </p>
      <Link to="/create_invoice" exact>
        <button> + </button>
      </Link>
    </div>
  );
};

export default AddInvoice;
