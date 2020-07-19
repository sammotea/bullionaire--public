import React, { useState, useEffect } from "react";

import rawTransactions from "./json/realTransactions.json";

import parser from "./_helpers/parsers/transactionParser";
import * as spotPriceParser from "./_helpers/parsers/spotPriceParser";

import Summary from "./_components/Summary";
import AssetSnapshotAll from "./_components/AssetSnapshotAll";
import Transactions from "./_components/Transactions";

function Bullionaire() {
  const useManualPrices = true;
  const manualSpotPrices = {
    // as of 03/01/2020
    gold: 40095.88,
    silver: 423.58,
  };
  const bullionApi =
    "https://www.metals-api.com/api/latest?access_key=putumntqnjat4yrmbi7h3250wqviwmrgx8a83uwiznpg5y2jkl3yhsw91j22&base=GBP&symbols=XAU,XAG";

  function pretendToParseExcelForTransactions() {
    return rawTransactions.transactions;
  }

  const transactions = pretendToParseExcelForTransactions();

  const [hasPrices, setHasPrices] = useState(false);
  const [spotPrices, setSpotPrices] = useState(manualSpotPrices);

  parser.init(transactions);
  parser.setAssetsUnderManagement(spotPrices);

  useEffect(() => {
    // Only get 10 API calls a month, the snide bastards

    if (!useManualPrices) {
      // Pending: No fail state
      fetch(bullionApi)
        .then((res) => res.json())
        .then((result) => {
          const currentSpotPrices = spotPriceParser.transformSpotPriceObject(
            result
          );

          setSpotPrices(currentSpotPrices);
        });
    }
  }, []);

  const totalValue = parser.getValueOfAssetsUnderManagement(),
    totalCost = parser.getCostOfAssetsUnderManagement(),
    aum = parser.getAssetsUnderManagement();

  function getSectionClassNames(section = "") {
    if (section) section = "c-" + section;

    return "[ l-module | " + section + " ]";
  }

  function renderSummary() {
    if (totalValue && totalCost) {
      return (
        <section className={getSectionClassNames("summary")}>
          <Summary {...{ totalValue, totalCost }} />
        </section>
      );
    }
  }

  function renderAssetSnapshots() {
    if (aum && spotPrices) {
      return (
        <section className={getSectionClassNames("assets")}>
          <AssetSnapshotAll {...{ aum, spotPrices }} />
        </section>
      );
    }
  }

  function renderTransactions() {
    return (
      <section className={getSectionClassNames("transactions")}>
        <Transactions />
      </section>
    );
  }

  return (
    <>
      {renderSummary()}
      {renderAssetSnapshots()}
      {renderTransactions()}
    </>
  );
}

export default Bullionaire;
