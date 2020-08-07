import React from "react";
import Single from "./Single";

const Assets: React.FC<IAssetsProps> = ({ aum, spotPrices }) => {
  function renderSnapshots() {
    return <>{getSnapshots()}</>;
  }

  function getSnapshots() {
    const snapshots = [];
    const aumByAsset = aum.byAsset;
    const totalValue = aum.total.value;

    for (let asset in aumByAsset) {
      const { value, cost, quantity } = aumByAsset[
        asset as BullionTypes
      ];

      snapshots.push(
        <Single
          key={asset as BullionTypes}
          assetName={asset as BullionTypes}
          proportionalValue={value / totalValue}
          spotPrice={spotPrices[asset as BullionTypes]}
          {...{ quantity, value, cost }}
        />
      );
    }

    return snapshots;
  }

  return renderSnapshots();
};

export default Assets;
