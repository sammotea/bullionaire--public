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
  cost: number;
  quantity: number;
};

type Aum = {
  total: {
    value: number;
    cost: number;
  };
  byAsset: {
    [K in BullionTypes]: AssetTotal;
  };
};

interface IParser {
  rawTransactions: RawTransaction[];
  transactions: Transaction[];
  transactionsByYear: TransactionsByYear;
  transactionsByAsset: TransactionsByAsset;
  assetsUnderManagement: Aum;
  aumIsKnown: boolean;
  init(t: RawTransaction[]): void;
  mergeAndRefineTransactions(t: RawTransaction[]): Transaction[];
  mergeTransactions(t: RawTransaction[]): RawTransaction;
  refineTransaction(t: RawTransaction): Transaction;
  renameAttributes(t: RawTransaction): RawTransactionWithRenames;
  typifyAttributes(t: RawTransactionWithRenames): Transaction;
  convertToDate(d: string): Date;
  removeAttributes(t: RawTransaction): RawTransaction;
  categoriseTransactions(
    t: Transaction[]
  ): {
    byYear: TransactionsByYear;
    byAsset: TransactionsByAsset;
  };
  setAssetsUnderManagement(s: SpotPrices): boolean;
  checkHaveAllAssets(s: SpotPrices): boolean;
  getAssetTypes(): BullionTypes[];
  calculateAssetTotals(a: BullionTypes, s: number): AssetTotal;
  calculateTotals(
    a: { [K in BullionTypes]: AssetTotal }
  ): { value: number; cost: number };
  getTransactions(): Transaction[];
  getTransactionsByYear(
    y?: string,
    a?: BullionTypes
  ): Transaction[] | TransactionsByYear;
  getTransactionsByAsset(
    a?: BullionTypes,
    y?: string
  ): Transaction[] | TransactionsByAsset;
  getAssetTypes(): BullionTypes[];
  getTransactionPeriods(): string[];
  getAssetsUnderManagement(): Aum;
  getCostOfAssetsUnderManagement(a?: BullionTypes): number;
  getValueOfAssetsUnderManagement(a?: BullionTypes): number;
  getQuantityOfAssetsUnderManagement(
    a?: BullionTypes
  ): number | { [K in BullionTypes]: number };
}

interface ISummaryProps {
  totalValue: number;
  totalCost: number;
}
