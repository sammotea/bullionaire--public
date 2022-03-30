type BullionTypes = "gold" | "silver";
type SpotPrices = {
   [K in BullionTypes]: number;
};

type RawTransaction = {
   date: string;
   asset: string;
   // PENDING set assets as BullionTypes
   action: string;
   // PENDING set action as 'buy' | 'sell'
   amount: number;
   cost: number;
   from?: string;
   id?: string;
   location?: string;
   unit?: string;
};

type RawTransactionWithRenames = {
   quantity: number;
} & Omit<RawTransaction, "amount">;

type Transaction = {
   date: Date;
   asset: string;
   // PENDING set assets as BullionTypes
   action: string;
   // PENDING set action as 'buy' | 'sell'
   quantity: number;
   cost: number;
};

type TransactionsByYear = {
   [prop: string]: {
      // year
      raw: Transaction[];
      byAsset: {
         [K in BullionTypes]: Transaction[];
      };
   };
};

type TransactionsByAsset = {
   [K in BullionTypes]: {
      raw: Transaction[];
      byYear: {
         [prop: string]: Transaction[]; // year
      };
   };
};

type AssetTotal = {
   value: number;
   quantity: number;
};

type AssetsSummary = {
   [K in BullionTypes]: AssetSummary;
};

type AssetSummary = {
   value: number;
   quantity: number;
   paid: number;
   received: number;
};

type LifetimeValues = {
   credit: number;
   debit: number;
};

type Aum = {
   total: number;
   byAsset: {
      [K in BullionTypes]: AssetTotal;
   };
};

type Cashflow = {
   profit: number;
   paid: number;
   received: number;
};

type TransactionFilters = {
   [prop: string]: string;
};
