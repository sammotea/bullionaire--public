import React from "react";
import * as f from "../../_helpers/formatter";

function Single(props) {
  const {
    assetName,
    quantity,
    value,
    cost,
    proportionalValue,
    spotPrice,
  } = props;
  const balance = value - cost;

  return (
    <div className="[ c-asset ]">
      <h1>{assetName}</h1>

      <h2>{f.poundify(value)}</h2>

      <small>{f.percentify(proportionalValue)} of AUM by value</small>

      <ul>
        <li>
          {f.kiloify(quantity)} @ {f.poundify(spotPrice)}/kg
        </li>

        <li>Bought at {f.poundify(cost / quantity)}/kg</li>

        <li>
          {f.poundify(balance)}
          {balance >= 0 ? " profit (+" : " loss ("}
          {f.percentify(balance / cost)})
        </li>
      </ul>
    </div>
  );
}

export default Single;
