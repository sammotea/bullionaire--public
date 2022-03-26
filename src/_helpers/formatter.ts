const currencyFormatter = new Intl.NumberFormat("en-UK", {
   style: "currency",
   currency: "GBP",
});

const dateFormatter = new Intl.DateTimeFormat("en-US");

export const poundify = (amount: number): string => {
   return currencyFormatter.format(amount);
};

export const kiloify = (number: number): string => {
   return number.toFixed(2) + "kg";
};

export const percentify = (number: number): string => {
   return Math.abs(number * 100).toFixed(0) + "%";
};

export const datify = (date: Date): string => {
   return dateFormatter.format(date);
};

export const showify = (string: string): string => {
   return "show" + string.charAt(0).toUpperCase() + string.slice(1);
};
