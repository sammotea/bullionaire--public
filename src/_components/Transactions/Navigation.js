import React from "react";
import * as f from "../../_helpers/formatter";

function Navigation(props) {
  function renderNavigation() {
    const { assets, periods } = props;
    const variables = {
      actions: ["buy", "sell"],
      assets: assets,
      periods: periods,
    };

    const userSelections = getSelects(variables);

    if (userSelections) {
      return (
        <div className="[ c-transactions__filters ]">
          {userSelections}
        </div>
      );
    }
  }
  function setOptionValue(option, selectID) {
    return option;
  }

  function setOptionName(option, selectID) {
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

  function getSelectOptions(optionsArray, selectID) {
    const options = [];
    const optionsLoop = optionsArray.concat(["all"]); // Add a default selection

    optionsLoop.forEach((option) => {
      const optionValue = setOptionValue(option, selectID);
      const optionName = setOptionName(option, selectID);

      options.push(
        <option key={optionValue} value={optionValue}>
          {optionName}
        </option>
      );
    });

    return options;
  }

  function maybeAddConjunction(selectID) {
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

  function getSelects(selectsObject) {
    const selectsGroup = [];

    for (const selectID in selectsObject) {
      const selectOptions = getSelectOptions(
        selectsObject[selectID],
        selectID
      );
      const selected = props[f.showify(selectID)];
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

    return selectsGroup;
  }

  return renderNavigation();
}

export default Navigation;
