import React from "react";
import * as f from "../../../_helpers/formatter";

import Item from "./Item";

function Yeargroup(props) {
  function getItems() {
    const { transactions, showAssets, showActions } = props;
    const Items = [];

    if (Array.isArray(transactions)) {
      transactions.forEach((t) => {
        if (
          (showAssets !== "all" && showAssets !== t.asset) ||
          (showActions !== "all" && showActions !== t.action)
        ) {
          return;
        }

        let { date, ...props } = t;
        let id;

        date = f.datify(date);
        id = t.asset + t.action + date;

        Items.push(<Item key={id} date={date} {...props} />);
      });
    }

    return Items;
  }

  function renderItems() {
    const transactionItems = getItems();

    if (transactionItems.length > 0) {
      return (
        <li className="[ c-transactions__yearGroup ]">
          <h1 className="[ c-transactions__yearGroupTitle ]">
            {props.year}
          </h1>

          <ul className="[ c-transactions__list c-transactions__list--transactions ]">
            {transactionItems}
          </ul>
        </li>
      );
    }
  }

  return renderItems();
}

export default Yeargroup;
