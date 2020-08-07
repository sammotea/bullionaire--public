import React from "react";
import * as f from "../../../_helpers/formatter";

import Item from "./Item";

const Yeargroup: React.FC<ITransactionYearGroupProps> = ({
  year,
  transactions,
  showAssets,
  showActions,
}) => {
  function getItems() {
    const Items = [] as JSX.Element[];

    if (Array.isArray(transactions)) {
      transactions.forEach((t) => {
        if (
          (showAssets !== "all" && showAssets !== t.asset) ||
          (showActions !== "all" && showActions !== t.action)
        ) {
          return;
        }

        let { date, ...props } = t;

        let dateAsString = f.datify(date);
        let id = t.asset + t.action + date;

        Items.push(<Item key={id} date={dateAsString} {...props} />);
      });
    }

    return Items;
  }

  function renderItems(): JSX.Element {
    const transactionItems = getItems();

    if (transactionItems.length > 0) {
      return (
        <li className="[ c-transactions__yearGroup ]">
          <h1 className="[ c-transactions__yearGroupTitle ]">
            {year}
          </h1>

          <ul className="[ c-transactions__list c-transactions__list--transactions ]">
            {transactionItems}
          </ul>
        </li>
      );
    } else {
      return <></>;
    }
  }

  return renderItems();
};

export default Yeargroup;
