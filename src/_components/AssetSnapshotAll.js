import React from "react";
import AssetSnapshotSingle from "../_components/AssetSnapshotSingle";

function AssetSnapshotAll(props) {
  function getSnapshots(aumObject) {
    const snapshots = [];
    const aumByAsset = aumObject.byAsset;
    const totalValue = aumObject.total.value;

    for (const asset in aumByAsset) {
      const { value, cost, quantity } = aumByAsset[asset];

      snapshots.push(
        <AssetSnapshotSingle
          key={asset}
          assetName={asset}
          quantity={quantity}
          value={value}
          cost={cost}
          proportionalValue={value / totalValue}
          spotPrice={props.spotPrices[asset]}
        />
      );
    }

    return snapshots;
  }

  let snapshots;

  if (props.aum) {
    snapshots = getSnapshots(props.aum);
  }

  return <>{snapshots}</>;
}

export default AssetSnapshotAll;
