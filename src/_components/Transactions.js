import React, { useState } from "react";
import parser from "../_helpers/parsers/transactionParser";
import * as f from "../_helpers/formatter";

import TransactionNavigation from "../_components/TransactionNavigation";
import TransactionSummary from "../_components/TransactionSummary";
import TransactionList from "../_components/TransactionList";

function Transactions(props) {
  const [filters, setFilters] = useState({
    showAssets: "all",
    showActions: "all",
    showPeriods: "all",
  });

  const assets = parser.getAssetTypes(),
    periods = parser.getTransactionPeriods(),
    transactionsByYear = parser.getTransactionsByYear(),
    transactionsByAsset = parser.getTransactionsByAsset();

  function handleUserSelection(e) {
    let tempObj = {};
    tempObj[f.showify(e.target.id)] = e.target.value;

    const updatedFilters = Object.assign({}, filters, tempObj);

    setFilters(updatedFilters);
  }

  function renderTransactionNavigation() {
    if (assets && periods) {
      return (
        <TransactionNavigation
          selectionHandler={handleUserSelection}
          {...{ assets, periods }}
          {...filters}
        />
      );
    }
  }

  function renderTransactionSummary() {
    if (transactionsByYear && transactionsByAsset) {
      return (
        <TransactionSummary
          {...{ transactionsByYear, transactionsByAsset }}
          {...filters}
        />
      );
    }
  }

  function renderTransactionList() {
    if (transactionsByYear) {
      return (
        <TransactionList {...{ transactionsByYear }} {...filters} />
      );
    }
  }
  return (
    <>
      <h1>Transactions</h1>

      {renderTransactionNavigation()}
      {renderTransactionSummary()}
      {renderTransactionList()}
    </>
  );
}

export default Transactions;
