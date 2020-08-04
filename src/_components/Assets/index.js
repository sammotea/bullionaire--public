import React from "react";
import Single from "./Single";

function Assets(props) {
  function renderSnapshots() {
    return <>{getSnapshots()}</>;
  }

  function getSnapshots() {
    const snapshots = [];
    const aumByAsset = props.aum.byAsset;
    const totalValue = props.aum.total.value;

    for (const asset in aumByAsset) {
      const { value, cost, quantity } = aumByAsset[asset];

      snapshots.push(
        <Single
          key={asset}
          assetName={asset}
          proportionalValue={value / totalValue}
          spotPrice={props.spotPrices[asset]}
          {...{ quantity, value, cost }}
        />
      );
    }

    return snapshots;
  }

  return renderSnapshots();
}

export default Assets;
