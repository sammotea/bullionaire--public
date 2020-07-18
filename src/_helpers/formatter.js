const currencyFormatter = new Intl.NumberFormat("en-UK", {
  style: "currency",
  currency: "GBP",
});

const dateFormatter = new Intl.DateTimeFormat("en-US");

export function poundify(amount) {
  return currencyFormatter.format(amount);
}

export function kiloify(number) {
  return number.toFixed(2) + "kg";
}

export function percentify(number) {
  return (number * 100).toFixed(0) + "%";
}

export function datify(date) {
  return dateFormatter.format(date);
}

export function showify(string) {
  return "show" + string.charAt(0).toUpperCase() + string.slice(1);
}
