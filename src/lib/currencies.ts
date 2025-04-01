export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  country: string;
}

export const currencies: Record<string, Currency> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
    country: "United States",
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    decimals: 2,
    country: "Nigeria",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    decimals: 2,
    country: "European Union",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    decimals: 2,
    country: "United Kingdom",
  },
};

export const defaultCurrency = currencies.USD;

export function formatCurrency(amount: number, currencyCode: string = "USD"): string {
  const currency = currencies[currencyCode] || defaultCurrency;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(amount);
}

export function parseCurrency(amount: string, currencyCode: string = "USD"): number {
  const currency = currencies[currencyCode] || defaultCurrency;
  return parseFloat(amount.replace(/[^0-9.-]+/g, ""));
} 