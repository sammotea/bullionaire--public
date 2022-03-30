import React from "react";
import * as f from "../_helpers/formatter";

interface ISummaryProps {
   holdings: number;
   lifetimeProfit: number;
   lifetimeSpend: number;
}

const Summary: React.FC<ISummaryProps> = ({
   holdings,
   lifetimeProfit,
   lifetimeSpend,
}) => {
   const totalProfit = holdings + lifetimeProfit,
      roi = totalProfit / lifetimeSpend;

   return (
      <>
         <h1>{f.poundify(holdings)}</h1>

         <h2>
            {/* PENDING. This is ridiculous, Sam. String interpolation? */}
            {f.poundify(totalProfit)}
            {" lifetime"} {totalProfit > 0 ? " profit" : " loss"}
            {" ("}
            {roi >= 0 ? "+" : "-"}
            {f.percentify(roi)})
         </h2>
      </>
   );
};

export default Summary;
