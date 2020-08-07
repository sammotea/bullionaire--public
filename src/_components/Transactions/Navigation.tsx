import React from "react";
import * as f from "../../_helpers/formatter";

const Navigation: React.FC<ITransactionNavigationProps> = (props) => {
  function renderNavigation() {
    const { assets, periods } = props;
    const variables = {
      actions: ["buy", "sell"],
      assets: assets,
      periods: periods,
    } as TransactionNavigationSelects;

    const userSelections = getSelects(variables);

    if (userSelections) {
      return (
        <>
          (
          <div className="[ c-transactions__filters ]">
            {userSelections}
          </div>
          )
        </>
      );
    } else {
      return <></>;
    }
  }
  function setOptionValue(option: string): string {
    return option;
  }

  function setOptionName(option: string, selectID?: string): string {
    switch (option) {
      case "buy":
        option = "purchases";
        break;

      case "sell":
        option = "sales";
        break;

      case "all":
        option = "All " + selectID;
        break;

      default:
        break;
    }

    return option;
  }

  function getSelectOptions(
    optionsArray: string[],
    selectID: keyof TransactionNavigationSelects
  ) {
    const options = [] as JSX.Element[];
    const optionsLoop = optionsArray.concat(["all"]); // Add a default selection

    optionsLoop.forEach((option) => {
      const optionValue = setOptionValue(option);
      const optionName = setOptionName(option, selectID);

      options.push(
        <option key={optionValue} value={optionValue}>
          {optionName}
        </option>
      );
    });

    return options;
  }

  function maybeAddConjunction(
    selectID: keyof TransactionNavigationSelects
  ) {
    let conj;

    switch (selectID) {
      case "periods":
        conj = " for ";
        break;

      case "assets":
        conj = " of ";
        break;

      default:
        break;
    }

    return conj;
  }

  function getSelects(
    selectsObject: TransactionNavigationSelects
  ): JSX.Element {
    const selectsGroup = [] as JSX.Element[];

    let selectID: keyof TransactionNavigationSelects;
    for (selectID in selectsObject) {
      const selectOptions = getSelectOptions(
        selectsObject[selectID],
        selectID
      );

      const selection = f.showify(selectID) as
        | "showActions"
        | "showPeriods"
        | "showAssets";
      const selected = props[selection];
      const conj = maybeAddConjunction(selectID);

      selectsGroup.push(
        <React.Fragment key={selectID}>
          {conj && <span>{conj}</span>}

          <select
            id={selectID}
            onChange={props.selectionHandler}
            value={selected}
          >
            {selectOptions}
          </select>
        </React.Fragment>
      );
    }

    return <>{selectsGroup}</>;
  }

  return renderNavigation();
};

export default Navigation;
