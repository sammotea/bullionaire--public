import React from "react";
import Single from "./Single";

interface IAssetsProps {
   aum: AssetsSummary;
   spotPrices: SpotPrices;
   totalValue: number;
}

const Assets: React.FC<IAssetsProps> = ({
   aum,
   spotPrices,
   totalValue,
}) => {
   function renderSnapshots() {
      const snapshots = [];

      // Can only be these things (looping through aum below)
      let asset: BullionTypes;

      for (asset in aum) {
         const { value, quantity } = aum[asset];

         snapshots.push(
            <Single
               key={asset}
               assetName={asset}
               proportionalValue={value / totalValue}
               spotPrice={spotPrices[asset]}
               {...{ quantity, value }}
            />
         );
      }

      return snapshots;
   }

   return <>{renderSnapshots()}</>;
};

export default Assets;
