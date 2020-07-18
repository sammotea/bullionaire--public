import React from "react";
import * as f from "../_helpers/formatter";

function TransactionSummary(props) {
  function getTransactionsArray(transactionsObj) {
    /***
     ****	transactionsByYear and transactionsByAsset
     ****	have a nested structure that groups transactions
     ****	by both a category (e.g. ByYear = { '2017 : [] })
     ****	and as an unordered list ( raw = [] )
     ***/

    if (!transactionsObj) return false;

    return Array.isArray(transactionsObj)
      ? transactionsObj
      : transactionsObj["raw"];
  }

  function mergeTransactionsByAsset(transactions) {
    let mergedAssets = [];

    for (const asset in transactions) {
      mergedAssets = mergedAssets.concat(
        getTransactionsArray(transactions[asset])
      );
    }

    return mergedAssets;
  }

  function filterTransactions() {
    const { showPeriods, showAssets } = props;
    const transactions =
      showPeriods === "all"
        ? props.transactionsByAsset
        : props.transactionsByYear[showPeriods]["byAsset"];
    let filteredTransactions;

    if (showAssets === "all") {
      filteredTransactions = mergeTransactionsByAsset(transactions);
    } else {
      filteredTransactions = getTransactionsArray(
        transactions[showAssets]
      );
    }

    return filteredTransactions;
  }

  const filteredTransactions = filterTransactions();
  let purchases, sales;

  if (filteredTransactions) {
    purchases = sales = 0;

    filteredTransactions.forEach((t) => {
      if (
        props.showActions !== "all" &&
        t.action !== props.showActions
      )
        return;

      if (t.action === "buy") {
        purchases += t.cost;
      } else {
        sales -= t.cost;
      }
    });
  }

  return (
    <div className="[ c-transactions__summaries ]">
      {purchases > 0 && (
        <span className="[ c-transactions__summary ]">
          <b>Bought</b> {f.poundify(purchases)}
        </span>
      )}

      {sales > 0 && (
        <span className="[ c-transactions__summary ]">
          <b>Sold</b> {f.poundify(sales)}
        </span>
      )}
    </div>
  );
}

export default TransactionSummary;
