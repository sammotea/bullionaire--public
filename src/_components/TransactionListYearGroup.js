import React from "react";
import * as f from "../_helpers/formatter";

import TransactionListItem from "../_components/TransactionListItem";

function TransactionListYearGroup(props) {
  function getTransactionListItems() {
    const { transactions, showAssets, showActions } = props;
    const transactionListItems = [];

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

        transactionListItems.push(
          <TransactionListItem key={id} date={date} {...props} />
        );
      });
    }

    return transactionListItems;
  }

  function renderTransactionListItems() {
    const transactionItems = getTransactionListItems();

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

  return renderTransactionListItems();
}

export default TransactionListYearGroup;
