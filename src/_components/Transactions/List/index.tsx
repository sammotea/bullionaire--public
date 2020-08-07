import React from "react";

import Yeargroup from "./Yeargroup";

const List: React.FC<ITransactionListProps> = ({
  transactionsByYear,
  showPeriods,
  showAssets,
  showActions,
}) => {
  function getYearGroups(): JSX.Element[] {
    const yearGroups = [] as JSX.Element[];

    for (const year in transactionsByYear) {
      if (showPeriods !== "all" && showPeriods !== year) continue;

      // latest first
      yearGroups.unshift(
        <Yeargroup
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

  function renderYearGroups(): JSX.Element {
    const yearGroups = getYearGroups();

    if (yearGroups) {
      return (
        <ul className="[ c-transactions__list c-transactions__list--yearGroups ]">
          {yearGroups}
        </ul>
      );
    } else {
      return <></>;
    }
  }
  return renderYearGroups();
};

export default List;
