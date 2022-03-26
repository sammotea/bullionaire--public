import React from "react";
import Single from "./Single";

const Assets: React.FC<IAssetsProps> = ({
   aum,
   spotPrices,
   totalValue,
}) => {
   function renderSnapshots() {
      const snapshots = [];

      for (let asset in aum) {
         const { value, quantity } = aum[asset as BullionTypes];

         snapshots.push(
            <Single
               key={asset as BullionTypes}
               assetName={asset as BullionTypes}
               proportionalValue={value / totalValue}
               spotPrice={spotPrices[asset as BullionTypes]}
               {...{ quantity, value }}
            />
         );
      }

      return snapshots;
   }

   return <>{renderSnapshots()}</>;
};

export default Assets;
