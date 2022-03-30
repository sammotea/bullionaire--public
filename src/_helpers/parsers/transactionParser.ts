// Pending: refactor to avoid repeat loops for calculations; use one central loop, somewhere.

const parser = {
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

         this.setAssetValues(spotPrices);
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
            t.action === "sell" ? "received" : "paid"
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
         cashflow[t.action === "sell" ? "received" : "paid"] +=
            Math.abs(t.cost);
      });

      cashflow["profit"] = this.calculateCashflowProfit(cashflow);

      this.cashflow = cashflow;

      console.log(cashflow);
   },

   calculateCashflowProfit(cashflow: Cashflow): number {
      const { paid, received } = cashflow;

      return received - paid;
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

   setAssetValues(spotPrices: SpotPrices): void {
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
      } else {
         console.log("Missing Assets!");
      }
   },

   checkHaveAllAssets(spotPrices: SpotPrices): boolean {
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

   getTransactions(): Transaction[] {
      return this.transactions;
   },

   getTransactionsByYear(
      year?: string,
      asset?: BullionTypes
   ): Transaction[] | TransactionsByYear {
      const transactions = {
         ...this.transactionsByYear,
      } as TransactionsByYear;

      if (year) {
         if (asset) {
            return transactions[year]["byAsset"][asset];
         } else {
            return transactions[year]["raw"];
         }
      } else {
         return transactions;
      }
   },

   getTransactionsByAsset(
      asset?: BullionTypes,
      year?: string
   ): Transaction[] | TransactionsByAsset {
      const transactions = { ...this.transactionsByAsset };

      if (asset) {
         if (year) {
            return transactions[asset]["byYear"][year];
         } else {
            return transactions[asset]["raw"];
         }
      } else {
         return transactions;
      }
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

   getAssetsSummary(): AssetsSummary {
      if (!this.aumIsKnown) {
         /* throw error */
      }

      return this.assetSummaries;
   },

   getValueOfAssetsUnderManagement(asset?: BullionTypes): number {
      if (!this.aumIsKnown) {
         console.log("Error getting asset values");
      }

      const aum = { ...this.assetSummaries };

      if (asset) {
         return aum[asset]["value"];
      } else {
         let totalValue = 0;

         this.getAssetTypes().forEach((asset) => {
            totalValue += aum[asset]["value"];
         });

         return totalValue;
      }
   },

   getCashflowItem(search: "paid" | "received" | "profit"): number {
      return this.cashflow[search];
   },
};

export default parser;
