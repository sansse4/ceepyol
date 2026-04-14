export type PaymentMethodId = "credit_card" | "crypto" | "wise" | "binance_qr";

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
    "Wise uygulamanızı açın veya wise.com adresini ziyaret edin",
    "Yukarıda gösterilen tam tutarı e-posta adresine gönderin",
    "Ödeme referansı olarak Sipariş Numaranızı kullanın",
  ],
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "credit_card",
    label: "Kredi Kartı",
    labelAr: "بطاقة ائتمان",
    icon: "credit_card",
    description: "Visa, Mastercard veya AMEX ile ödeyin",
  },
  {
    id: "crypto",
    label: "Kripto Para",
    labelAr: "عملات رقمية",
    icon: "currency_bitcoin",
    description: "BTC, USDT veya ETH ile ödeyin",
  },
  {
    id: "wise",
    label: "Wise Havale",
    labelAr: "تحويل Wise",
    icon: "account_balance",
    description: "Wise ile para gönderin",
  },
  {
    id: "binance_qr",
    label: "Binance QR",
    labelAr: "دفع بالباركود",
    icon: "qr_code",
    description: "Binance uygulaması ile QR kodu okutarak ödeyin",
  },
];
