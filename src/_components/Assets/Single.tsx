import React from "react";
import * as f from "../../_helpers/formatter";

const Single: React.FC<ISingleAssetProps> = ({
   assetName,
   quantity,
   value,
   proportionalValue,
   spotPrice,
}) => {
   const balance = value;

   return (
      <div className="[ c-asset ]">
         <h1>{assetName}</h1>

         <h2>{f.poundify(value)}</h2>

         <small>
            {f.percentify(proportionalValue)} of AUM by value
         </small>

         <ul>
            <li>
               {f.kiloify(quantity)} @ {f.poundify(spotPrice)}/kg
            </li>

            <li>Bought at {f.poundify(quantity)}/kg</li>

            <li>
               {f.poundify(balance)}
               {balance >= 0 ? " profit (+" : " loss ("}
               {f.percentify(balance)})
            </li>
         </ul>
      </div>
   );
};

export default Single;
