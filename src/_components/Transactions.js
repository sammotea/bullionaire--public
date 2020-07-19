import React, { useState } from "react";
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

  const transactionParser = props.transactionParser;

  function handleUserSelection(e) {
    let tempObj = {};
    tempObj[f.showify(e.target.id)] = e.target.value;

    const updatedFilters = Object.assign({}, filters, tempObj);

    setFilters(updatedFilters);
  }

  return (
    <>
      <h1>Transactions</h1>

      <TransactionNavigation
        assets={transactionParser.getAssetTypes()}
        periods={transactionParser.getTransactionPeriods()}
        selectionHandler={handleUserSelection}
        {...filters}
      />

      <TransactionSummary
        transactionsByYear={transactionParser.getTransactionsByYear()}
        transactionsByAsset={transactionParser.getTransactionsByAsset()}
        {...filters}
      />

      <TransactionList
        transactionsByYear={transactionParser.getTransactionsByYear()}
        {...filters}
      />
    </>
  );
}

export default Transactions;
