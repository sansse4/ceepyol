export type PaymentMethodId = "credit_card" | "crypto" | "wise";

export interface CryptoWallet {
  currency: string;
  symbol: string;
  address: string;
  network: string;
  icon: string;
}

export interface WiseDetails {
  email: string;
  accountHolder: string;
  instructions: string[];
}

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  labelAr: string;
  icon: string;
  description: string;
}

export const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    currency: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin",
    icon: "currency_bitcoin",
  },
  {
    currency: "USDT",
    symbol: "USDT",
    address: "TN9RRaXkCFtTXRso2GdTZxSxxwufPMhcqL",
    network: "TRC20",
    icon: "toll",
  },
  {
    currency: "Ethereum",
    symbol: "ETH",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    network: "ERC20",
    icon: "diamond",
  },
];

export const WISE_DETAILS: WiseDetails = {
  email: "payments@ceepyol.store",
  accountHolder: "ceepyol LLC",
  instructions: [
    "Open your Wise app or visit wise.com",
    "Send the exact amount shown to the email address above",
    "Use your Order ID as the payment reference",
  ],
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "credit_card",
    label: "Credit Card",
    labelAr: "بطاقة ائتمان",
    icon: "credit_card",
    description: "Pay with Visa, Mastercard, or AMEX",
  },
  {
    id: "crypto",
    label: "Cryptocurrency",
    labelAr: "عملات رقمية",
    icon: "currency_bitcoin",
    description: "Pay with BTC, USDT, or ETH",
  },
  {
    id: "wise",
    label: "Wise Transfer",
    labelAr: "تحويل Wise",
    icon: "account_balance",
    description: "Send money via Wise",
  },
];
