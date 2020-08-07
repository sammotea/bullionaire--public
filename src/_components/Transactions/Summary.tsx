import React from "react";
import * as f from "../../_helpers/formatter";

const Summary: React.FC<ITransactionSummaryProps> = (props) => {
  function getTransactionsArray(
    transactionsObj: Transaction[] | { raw: Transaction[] }
  ): Transaction[] {
    /***
     ****	transactionsByYear and transactionsByAsset
     ****	have a nested structure that groups transactions
     ****	by both a category (e.g. ByYear = { '2017 : [] })
     ****	and as an unordered list ( raw = [] )
     ***/

    return Array.isArray(transactionsObj)
      ? transactionsObj
      : transactionsObj["raw"];
  }

  function mergeTransactionsByAsset(
    transactions:
      | TransactionsByAsset
      | { [K in BullionTypes]: Transaction[] }
  ) {
    let mergedAssets = [] as Transaction[];

    let asset: BullionTypes;
    for (asset in transactions) {
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
    let filteredTransactions: Transaction[];

    if (showAssets === "all") {
      filteredTransactions = mergeTransactionsByAsset(transactions);
    } else {
      let asset = showAssets as BullionTypes;
      filteredTransactions = getTransactionsArray(
        transactions[asset]
      );
    }

    return filteredTransactions;
  }

  const filteredTransactions = filterTransactions();
  let purchases = 0;
  let sales = 0;

  if (filteredTransactions) {
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

  if (purchases > 0 || sales > 0) {
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
  } else {
    return <></>;
  }
};

export default Summary;
