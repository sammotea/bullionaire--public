interface ISpotPriceObject {
   rates: {
      [propName: string]: number;
   };
   unit: string;
}

export const transformSpotPriceObject = (
   spotPriceObject: ISpotPriceObject
) => {
   let spo = { ...spotPriceObject };

   if (spo && spo.rates) {
      let transformedSpotPrices: { [propName: string]: number } = {};

      for (const type in spo.rates) {
         transformedSpotPrices[englishifySpotPrices(type)] = kiloify(
            spo.rates[type],
            spo.unit
         );
      }

      return transformedSpotPrices as SpotPrices;
   } else {
      return false;
   }
};

export const kiloify = (amount: number, unit: string) => {
   switch (unit) {
      case "per ounce":
         amount = amount * 32.151;
         break;

      default:
         // PENDING Throw error and fallback action
         console.log("ERROR!");
         amount = 0;
   }

   return amount;
};

export const englishifySpotPrices = (name: string) => {
   switch (name) {
      case "XAG":
         name = "silver";
         break;

      case "XAU":
         name = "gold";
         break;

      default:
         break;
   }

   return name;
};
