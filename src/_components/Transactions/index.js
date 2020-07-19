import React, { useState } from "react";
import parser from "../../_helpers/parsers/transactionParser";
import * as f from "../../_helpers/formatter";

import Navigation from "./Navigation";
import Summary from "./Summary";
import List from "./List/";

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

  function renderNavigation() {
    if (assets && periods) {
      return (
        <Navigation
          selectionHandler={handleUserSelection}
          {...{ assets, periods }}
          {...filters}
        />
      );
    }
  }

  function renderSummary() {
    if (transactionsByYear && transactionsByAsset) {
      return (
        <Summary
          {...{ transactionsByYear, transactionsByAsset }}
          {...filters}
        />
      );
    }
  }

  function renderList() {
    if (transactionsByYear) {
      return <List {...{ transactionsByYear }} {...filters} />;
    }
  }
  return (
    <>
      <h1>Transactions</h1>

      {renderNavigation()}
      {renderSummary()}
      {renderList()}
    </>
  );
}

export default Transactions;
