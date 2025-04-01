export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  country: string;
  exchangeRate?: number;
}

export const currencies: Record<string, Currency> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
    country: "United States",
    exchangeRate: 1,
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    decimals: 2,
    country: "Nigeria",
    exchangeRate: 0.00067, // Example rate: 1 USD = 1492.54 NGN
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    decimals: 2,
    country: "European Union",
    exchangeRate: 0.92, // Example rate: 1 USD = 1.09 EUR
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    decimals: 2,
    country: "United Kingdom",
    exchangeRate: 0.79, // Example rate: 1 USD = 1.27 GBP
  },
};

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode];
  if (!currency) throw new Error(`Unsupported currency: ${currencyCode}`);

  return new Intl.NumberFormat(currency.country, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(amount);
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const from = currencies[fromCurrency];
  const to = currencies[toCurrency];
  
  if (!from || !to) throw new Error("Unsupported currency");
  
  // Convert to USD first (as base currency)
  const amountInUSD = amount / (from.exchangeRate || 1);
  // Convert from USD to target currency
  return amountInUSD * (to.exchangeRate || 1);
} 