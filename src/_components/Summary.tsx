import React from "react";
import * as f from "../_helpers/formatter";

const Summary: React.FC<ISummaryProps> = ({ totalValue }) => {
   const balance = totalValue;
   const percDiff = f.percentify(balance);

   return (
      <>
         <h1>{f.poundify(totalValue)}</h1>

         <h2>
            {f.poundify(balance)}
            {balance > 0 ? " profit" : " loss"} (
            {balance > 0 ? "+" + percDiff : percDiff})
         </h2>
      </>
   );
};

export default Summary;
