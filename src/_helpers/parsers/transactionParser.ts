// Pending: refactor to avoid repeat loops for calculations; use one central loop, somewhere.

const parser: IParser = {
   /***
    ****	Some Assumptions
    ****
    ****	1) raw transactions are already date-ordered
    ****	2) All key / values are as expected
    ****		-> There are no real checks or error reports if wrong
    ***/

   rawTransactions: [] as RawTransaction[],
   transactions: [] as Transaction[],
   transactionsByYear: {} as TransactionsByYear,
   transactionsByAsset: {} as TransactionsByAsset,
   assetSummaries: {} as AssetsSummary,
   cashflow: {} as Cashflow,
   aumIsKnown: false,

   init(
      transactionsArray: RawTransaction[],
      spotPrices: SpotPrices
   ): void {
      const transactions = [...transactionsArray];

      if (Array.isArray(transactions)) {
         let refinedTransactions =
            this.mergeAndRefineTransactions(transactions);
         let categorisedTransactions = this.categoriseTransactions(
            refinedTransactions
         );

         this.rawTransactions = transactionsArray;
         this.transactions = refinedTransactions;
         this.transactionsByYear = categorisedTransactions["byYear"];
         this.transactionsByAsset =
            categorisedTransactions["byAsset"];

         this.summariseAssets(this.transactions);
         this.summariseCashflow(this.transactions);

         this.calculateAssetValues(spotPrices);
      } else {
         // error message
      }
   },

   summariseAssets(transactions: Transaction[]): void {
      let assetSummaries = {} as AssetsSummary;

      transactions.forEach((t) => {
         const { asset } = t;

         // Pending: revise Typescript to remove this hack
         if (asset !== "gold" && asset !== "silver") return;

         if (!assetSummaries.hasOwnProperty(asset)) {
            assetSummaries[asset] = {
               value: 0,
               quantity: 0,
               paid: 0,
               received: 0,
            };
         }

         assetSummaries[asset].quantity += t.quantity;
         assetSummaries[asset][
            t.action === "sell" ? "paid" : "received"
         ] += Math.abs(t.cost);
      });

      this.assetSummaries = assetSummaries;

      console.log(assetSummaries);
   },

   summariseCashflow(transactions: Transaction[]): void {
      let cashflow = {
         paid: 0,
         received: 0,
      } as Cashflow;

      transactions.forEach((t) => {
         cashflow[t.action === "sell" ? "paid" : "received"] +=
            Math.abs(t.cost);
      });

      cashflow["profit"] = this.calculateCashflowProfit(cashflow);

      this.cashflow = cashflow;

      console.log(cashflow);
   },

   calculateCashflowProfit(cashflow: Cashflow): number {
      const { paid, received } = cashflow;

      return paid - received;
   },

   mergeAndRefineTransactions(
      rawTransactions: RawTransaction[]
   ): Transaction[] {
      //	Need one extra for the merge loop
      const rawTransactionsPlusFiller = rawTransactions.concat([
            {
               date: "",
               asset: "",
               action: "",
               amount: 0,
               cost: 0,
            },
         ]),
         refinedTransactions: Transaction[] = [];

      let toMerge: RawTransaction[] = [],
         shouldMerge = false,
         previousTransaction: RawTransaction;

      rawTransactionsPlusFiller.forEach((t, index) => {
         let transaction = { ...t };

         /* First we merge like transactions */
         if (previousTransaction) {
            //	Stage for merging if partial purchase
            if (
               t.date === previousTransaction.date &&
               t.action === previousTransaction.action &&
               t.asset === previousTransaction.asset
            ) {
               shouldMerge = true;
               toMerge.push(previousTransaction);
            } else {
               // Ready for merging
               if (shouldMerge === true) {
                  toMerge.push(previousTransaction);

                  previousTransaction =
                     this.mergeTransactions(toMerge);

                  refinedTransactions.push(
                     this.refineTransaction(previousTransaction)
                  );

                  // reset
                  toMerge = [];
                  shouldMerge = false;
               } else {
                  refinedTransactions.push(
                     this.refineTransaction(previousTransaction)
                  );
               }
            }
         }

         previousTransaction = transaction;
      });

      return refinedTransactions;
   },

   mergeTransactions(
      transactionArray: RawTransaction[]
   ): RawTransaction {
      const mergedTransaction: RawTransaction = {
         ...transactionArray[0],
      };

      transactionArray.forEach((t, index) => {
         if (index > 0) {
            mergedTransaction.cost += t.cost;
            mergedTransaction.amount += t.amount;
         }
      });

      return mergedTransaction;
   },

   refineTransaction(transaction: RawTransaction): Transaction {
      let deattributedTransaction: RawTransaction,
         renamedTransaction: RawTransactionWithRenames,
         typifiedTransaction: Transaction;

      deattributedTransaction = this.removeAttributes(transaction);
      renamedTransaction = this.renameAttributes(
         deattributedTransaction
      );
      typifiedTransaction = this.typifyAttributes(renamedTransaction);

      return typifiedTransaction;
   },

   renameAttributes(
      transaction: RawTransaction
   ): RawTransactionWithRenames {
      const { amount, ...t } = transaction,
         renamedTransaction = Object.assign(t, { quantity: amount });

      return renamedTransaction;
   },

   typifyAttributes(
      transaction: RawTransactionWithRenames
   ): Transaction {
      const sell = transaction.action === "sell" ? true : false;

      const { date, ...t } = transaction,
         realDate = this.convertToDate(date),
         typifiedTransaction = Object.assign(t, { date: realDate });

      if (sell) {
         typifiedTransaction.quantity = -typifiedTransaction.quantity;
         typifiedTransaction.cost = -typifiedTransaction.cost;
      }

      return typifiedTransaction;
   },

   convertToDate(dateString: string): Date {
      const [y, m, d] = dateString.split("-");
      const date = new Date(
         parseInt(y),
         parseInt(m) - 1,
         parseInt(d)
      );

      return date;
   },

   removeAttributes(transaction: RawTransaction): RawTransaction {
      const { from, id, location, unit, ...t } = transaction;

      return t;
   },

   categoriseTransactions(transactions: Transaction[]): {
      byYear: TransactionsByYear;
      byAsset: TransactionsByAsset;
   } {
      /***
       ****
       ****	categoriseTransaction object structure is:
       ****
       ****	{
       ****
       ****		'byYear'	:	{
       ****
       ****			'2020'		:	{
       ****
       ****				'byAsset'	:	{
       ****
       ****					'assetOne'	:	[ {}{} ],
       ****
       ****					'assetTwo'	:	[ {}{} ]
       ****
       ****				}
       ****
       ****				'raw'			:	[ {}{} ]
       ****
       ****			}
       ****
       ****		}
       ****
       ****		'byAsset'	:	{
       ****
       ****			'assetOne'		:	{
       ****
       ****				'byYear'	:	{
       ****
       ****					'2020'	:	[ {}{} ],
       ****
       ****					'2019'	:	[ {}{} ]
       ****
       ****				}
       ****
       ****				'raw'			:	[ {}{} ]
       ****
       ****			}
       ****
       ****		}
       ****
       ****	}
       ****
       ***/

      const byYear = {} as TransactionsByYear;
      const byAsset = {} as TransactionsByAsset;

      transactions.forEach((t) => {
         const asset = t.asset as BullionTypes,
            year = "" + t.date.getFullYear();

         if (!byYear.hasOwnProperty(year)) {
            byYear[year] = {
               byAsset: {} as { [K in BullionTypes]: Transaction[] },
               raw: [],
            };
         }

         if (!byAsset.hasOwnProperty(asset)) {
            byAsset[asset] = {
               byYear: {},
               raw: [],
            };
         }

         if (!byYear[year]["byAsset"].hasOwnProperty(asset)) {
            byYear[year]["byAsset"][asset] = [] as Transaction[];
         }

         if (!byAsset[asset]["byYear"].hasOwnProperty(year)) {
            byAsset[asset]["byYear"][year] = [] as Transaction[];
         }

         // Go, go, gadget!
         byYear[year]["raw"].push(t);
         byYear[year]["byAsset"][asset].push(t);
         byAsset[asset]["raw"].push(t);
         byAsset[asset]["byYear"][year].push(t);
      });

      return { byYear: byYear, byAsset: byAsset };
   },

   calculateAssetValues(spotPrices) {
      const allAssetsAccountedFor =
         this.checkHaveAllAssets(spotPrices);

      if (allAssetsAccountedFor) {
         const assets = this.getAssetTypes();

         assets.forEach((asset) => {
            this.assetSummaries[asset]["value"] =
               spotPrices[asset] *
               this.assetSummaries[asset]["quantity"];
         });
         this.aumIsKnown = true;

         return true;
      } else {
         console.log("Missing Assets!");
         return false;
      }
   },

   checkHaveAllAssets(spotPrices) {
      const assets = this.getAssetTypes();
      let assetIsMissing = false;

      assets.forEach((asset) => {
         if (!spotPrices[asset]) {
            assetIsMissing = true;
         }
      });

      return !assetIsMissing;
   },

   calculateAssetHolding(
      asset: BullionTypes,
      spotPrice: number
   ): AssetTotal {
      const transactionsByAsset = this.getTransactionsByAsset(
         asset
      ) as Transaction[];
      const assetTotals = {
         value: 0,
         quantity: 0,
      } as AssetTotal;

      transactionsByAsset.forEach((t) => {
         assetTotals["quantity"] += t["quantity"];
      });

      assetTotals["value"] = spotPrice * assetTotals["quantity"];

      return assetTotals;
   },

   calculateTotalValue(assetTotals) {
      let value = 0;

      for (let asset in assetTotals) {
         let tAsset = asset as BullionTypes;
         value += assetTotals[tAsset]["value"];
      }

      return value;
   },

   getTransactions(): Transaction[] {
      return this.transactions;
   },

   getTransactionsByYear(
      year,
      asset
   ): Transaction[] | TransactionsByYear {
      const transactions = { ...this.transactionsByYear };
      let result;

      if (year) {
         if (asset) {
            result = transactions[year]["byAsset"][asset];
         } else {
            result = transactions[year]["raw"];
         }
      } else {
         result = transactions;
      }

      return result;
   },

   getTransactionsByAsset(
      asset,
      year
   ): Transaction[] | TransactionsByAsset {
      const transactions = { ...this.transactionsByAsset };
      let result;

      if (asset) {
         if (year) {
            result = transactions[asset]["byYear"][year];
         } else {
            result = transactions[asset]["raw"];
         }
      } else {
         result = transactions;
      }

      return result;
   },

   getAssetTypes(): BullionTypes[] {
      const transactionsByAsset =
         this.getTransactionsByAsset() as TransactionsByAsset;

      const assetTypes = Object.keys(
         transactionsByAsset
      ) as BullionTypes[];
      return assetTypes;
   },

   getTransactionPeriods(): string[] {
      const transactionsByYear = this.getTransactionsByYear();

      return Object.keys(transactionsByYear);
   },

   // getAssetsUnderManagement(): Aum {
   //    if (!this.aumIsKnown) {
   //       /* throw error */
   //    }

   //    return this.assetsUnderManagement;
   // },

   //  getCostOfAssetsUnderManagement(asset): number {
   //     if (!this.aumIsKnown) {
   //        /* throw error */
   //     }

   //     const aum = { ...this.assetsUnderManagement };

   //     if (asset) {
   //        return aum["byAsset"][asset]["cost"];
   //     } else {
   //        return aum["total"];
   //     }
   //  },

   // getValueOfAssetsUnderManagement(asset): number {
   //    if (!this.aumIsKnown) {
   //       /* throw error */
   //    }

   //    const aum = { ...this.assetsUnderManagement };

   //    if (asset) {
   //       return aum["byAsset"][asset]["value"];
   //    } else {
   //       return aum["total"];
   //    }
   // },

   // getQuantityOfAssetsUnderManagement(
   //    asset
   // ): number | { [K in BullionTypes]: number } {
   //    if (!this.aumIsKnown) {
   //       /* throw error */
   //    }

   //    const aum = { ...this.assetsUnderManagement };

   //    if (asset) {
   //       return aum["byAsset"][asset]["quantity"];
   //    } else {
   //       const quantities = {} as { [K in BullionTypes]: number };

   //       for (let asset in aum["byAsset"]) {
   //          let tAsset = asset as BullionTypes;
   //          quantities[tAsset] = aum["byAsset"][tAsset]["quantity"];
   //       }

   //       return quantities;
   //    }
   // },
};

export default parser;
