import React, { useState } from "react";
import parser from "../../_helpers/parsers/transactionParser";
import * as f from "../../_helpers/formatter";

import Navigation from "./Navigation";
import Summary from "./Summary";
import List from "./List";

const Transactions: React.FC = () => {
   const [filters, setFilters] = useState({
      showAssets: "all",
      showActions: "all",
      showPeriods: "all",
   } as TransactionFilters);

   const assets = parser.getAssetTypes(),
      periods = parser.getTransactionPeriods(),
      transactionsByYear =
         parser.getTransactionsByYear() as TransactionsByYear,
      transactionsByAsset =
         parser.getTransactionsByAsset() as TransactionsByAsset;

   function handleUserSelection(
      e: React.ChangeEvent<HTMLSelectElement>
   ) {
      let tempObj = {} as TransactionFilters;
      tempObj[f.showify(e.target.id)] = e.target.value;

      const updatedFilters = Object.assign({}, filters, tempObj);
      setFilters(updatedFilters);
   }

   function renderNavigation() {
      if (assets && periods) {
         return (
            <Navigation
               selectionHandler={handleUserSelection}
               assets={assets}
               periods={periods}
               showActions={filters["showActions"]}
               showPeriods={filters["showPeriods"]}
               showAssets={filters["showAssets"]}
            />
         );
      }
   }

   function renderSummary() {
      if (transactionsByYear && transactionsByAsset) {
         return (
            <Summary
               transactionsByYear={transactionsByYear}
               transactionsByAsset={transactionsByAsset}
               showActions={filters["showActions"]}
               showPeriods={filters["showPeriods"]}
               showAssets={filters["showAssets"]}
            />
         );
      }
   }

   function renderList() {
      if (transactionsByYear) {
         return (
            <List
               transactionsByYear={transactionsByYear}
               showActions={filters["showActions"]}
               showPeriods={filters["showPeriods"]}
               showAssets={filters["showAssets"]}
            />
         );
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
};

export default Transactions;
