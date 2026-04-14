"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CRYPTO_WALLETS } from "@/lib/data/payment-config";

interface Props {
  total: number;
}

export default function CryptoPayment({ total }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const wallet = CRYPTO_WALLETS[selectedIndex];

  async function handleCopy() {
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5 animate-[fade-in-up_0.4s_ease-out]">
      <h3 className="font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">currency_bitcoin</span>
        Kripto Para ile Ödeme Gönderin
      </h3>

      {/* Currency selector */}
      <div className="flex gap-2">
        {CRYPTO_WALLETS.map((w, i) => (
          <button
            key={w.symbol}
            onClick={() => {
              setSelectedIndex(i);
              setCopied(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              i === selectedIndex
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{w.icon}</span>
            {w.symbol}
          </button>
        ))}
      </div>

      {/* QR + Address */}
      <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center gap-5">
        {/* Amount */}
        <div className="text-center">
          <p className="text-sm text-on-surface-variant mb-1">Ödenecek Tutar</p>
          <p className="text-2xl font-extrabold text-primary">₺{total.toFixed(2)}</p>
        </div>

        {/* QR Code */}
        <div className="bg-white dark:bg-surface-container p-4 rounded-2xl shadow-sm">
          <QRCodeSVG
            value={wallet.address}
            size={180}
            fgColor="#006e28"
            bgColor="#ffffff"
            level="M"
          />
        </div>

        {/* Network badge */}
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
          {wallet.network} Ağı
        </span>

        {/* Wallet address */}
        <div className="w-full">
          <p className="text-xs text-on-surface-variant mb-2 text-center">
            {wallet.currency} Cüzdan Adresi
          </p>
          <div className="flex items-center gap-2 bg-white dark:bg-surface-container-low rounded-xl p-3 border border-surface-variant">
            <code className="flex-1 text-xs font-mono break-all text-on-surface select-all">
              {wallet.address}
            </code>
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                copied
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? "check" : "content_copy"}
              </span>
              {copied ? "Kopyalandı!" : "Kopyala"}
            </button>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="material-symbols-outlined text-amber-600 shrink-0">info</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          Ödeme gönderdikten sonra siparişiniz{" "}
          <strong>&quot;Doğrulama Bekliyor&quot;</strong> durumunda oluşturulacaktır. 24 saat içinde
          ödemenizi onaylayacağız.
        </p>
      </div>
    </div>
  );
}
