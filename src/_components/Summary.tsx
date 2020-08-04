import React from "react";
import * as f from "../_helpers/formatter";

interface ISummaryProps {
  totalValue: number;
  totalCost: number;
}

const Summary: React.FC<ISummaryProps> = ({
  totalValue,
  totalCost,
}) => {
  const balance = totalValue - totalCost;
  const percDiff = f.percentify(balance / totalCost);

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
