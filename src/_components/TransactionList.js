import React from "react";

import TransactionListYearGroup from "../_components/TransactionListYearGroup";

function TransactionList(props) {
  function getYearGroups() {
    const {
      transactionsByYear,
      showPeriods,
      showAssets,
      showActions,
    } = props;
    const yearGroups = [];

    for (const year in transactionsByYear) {
      if (showPeriods !== "all" && showPeriods !== year) continue;

      // latest first
      yearGroups.unshift(
        <TransactionListYearGroup
          key={year}
          year={year}
          transactions={transactionsByYear[year]["raw"]}
          showAssets={showAssets}
          showActions={showActions}
        />
      );
    }

    return yearGroups;
  }

  function renderYearGroups() {
    const yearGroups = getYearGroups();

    if (yearGroups) {
      return (
        <ul className="[ c-transactions__list c-transactions__list--yearGroups ]">
          {yearGroups}
        </ul>
      );
    }
  }
  return renderYearGroups();
}

export default TransactionList;
