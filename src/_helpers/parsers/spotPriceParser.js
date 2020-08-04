export function transformSpotPriceObject(spotPriceObject) {
  let spo = { ...spotPriceObject };

  if (spo && spo.rates) {
    let transformedSpotPrices = {};

    for (const type in spo.rates) {
      transformedSpotPrices[
        this.englishifySpotPrices(type)
      ] = this.kiloify(spo.rates[type], spo.unit);
    }

    return transformedSpotPrices;
  } else {
    return false;
  }
}

export function kiloify(amount, unit) {
  switch (unit) {
    case "per ounce":
      amount = amount * 32.151;
      break;

    default:
      amount = false;
  }

  return amount;
}

export function englishifySpotPrices(name) {
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
}
