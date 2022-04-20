import React, { useState, useEffect } from "react";

import rawTransactions from "./json/fakeTransactions.json";

import parser from "./_helpers/parsers/transactionParser";
import * as spotPriceParser from "./_helpers/parsers/spotPriceParser";

import Summary from "./_components/Summary";
import Assets from "./_components/Assets";
import Transactions from "./_components/Transactions";

const Bullionaire: React.FC = () => {
   const useManualPrices = true;
   const manualSpotPrices: SpotPrices = {
      // as of 03/01/2020
      gold: 40095.88,
      silver: 423.58,
   };
   const bullionApi =
      "https://www.metals-api.com/api/latest?access_key=putumntqnjat4yrmbi7h3250wqviwmrgx8a83uwiznpg5y2jkl3yhsw91j22&base=GBP&symbols=XAU,XAG";

   const pretendToParseExcelForTransactions =
      function (): RawTransaction[] {
         return rawTransactions.transactions;
      };

   const transactions = pretendToParseExcelForTransactions();

   const [spotPrices, setSpotPrices] =
      useState<SpotPrices>(manualSpotPrices);

   parser.init(transactions, spotPrices);

   const fetchSpotPrices = async (url: string) => {
      let response = await fetch(url);

      return response.json();
   };

   useEffect(() => {
      // Only get 10 API calls a month, the snide bastards

      if (!useManualPrices) {
         // Pending: No fail state
         fetchSpotPrices(bullionApi).then((result) => {
            const currentSpotPrices =
               spotPriceParser.transformSpotPriceObject(result);

            if (currentSpotPrices) {
               setSpotPrices(currentSpotPrices);
            }
         });
      }
   }, [useManualPrices]);

   function getSectionClassNames(section = "") {
      if (section) section = "c-" + section;

      return "[ l-module | " + section + " ]";
   }

   function renderSummary() {
      return (
         <section className={getSectionClassNames("summary")}>
            <Summary
               holdings={parser.getValueOfAssetsUnderManagement()}
               lifetimeProfit={parser.getCashflowItem("profit")}
               lifetimeSpend={parser.getCashflowItem("paid")}
            />
         </section>
      );
   }

   function renderAssets() {
      return (
         <section className={getSectionClassNames("assets")}>
            {
               <Assets
                  aum={parser.getAssetsSummary()}
                  spotPrices={spotPrices}
                  totalValue={parser.getValueOfAssetsUnderManagement()}
               />
            }
         </section>
      );
   }

   function renderTransactions() {
      return (
         <section className={getSectionClassNames("transactions")}>
            <Transactions />
         </section>
      );
   }

   return (
      <>
         {renderSummary()}
         {renderAssets()}
         {renderTransactions()}
      </>
   );
};

export default Bullionaire;
