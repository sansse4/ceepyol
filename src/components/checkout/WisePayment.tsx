"use client";

import { useState } from "react";
import { WISE_DETAILS } from "@/lib/data/payment-config";

interface Props {
  total: number;
}

export default function WisePayment({ total }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(WISE_DETAILS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5 animate-[fade-in-up_0.4s_ease-out]">
      <h3 className="font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">account_balance</span>
        Pay via Wise Transfer
      </h3>

      {/* Wise account details */}
      <div className="bg-surface-container-low rounded-2xl p-6 space-y-5">
        {/* Amount */}
        <div className="text-center">
          <p className="text-sm text-on-surface-variant mb-1">Amount Due</p>
          <p className="text-2xl font-extrabold text-primary">${total.toFixed(2)}</p>
        </div>

        {/* Account holder */}
        <div className="bg-white dark:bg-surface-container rounded-xl p-4 border border-surface-variant text-center">
          <p className="text-xs text-on-surface-variant mb-1">Account Holder</p>
          <p className="font-bold text-lg">{WISE_DETAILS.accountHolder}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-xs text-on-surface-variant mb-2 text-center">Wise Email</p>
          <div className="flex items-center gap-2 bg-white dark:bg-surface-container-low rounded-xl p-3 border border-surface-variant">
            <code className="flex-1 text-sm font-mono text-on-surface text-center select-all">
              {WISE_DETAILS.email}
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
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Transfer steps */}
      <div className="bg-white dark:bg-surface-container rounded-2xl p-6 border border-surface-variant">
        <h4 className="font-bold text-sm mb-5">How to complete your payment</h4>
        <div className="space-y-0">
          {WISE_DETAILS.instructions.map((step, i) => (
            <div key={i} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                {i < WISE_DETAILS.instructions.length - 1 && (
                  <div className="w-0.5 h-8 bg-primary/20" />
                )}
              </div>
              {/* Text */}
              <p className="text-sm text-on-surface pt-1.5 pb-4">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="material-symbols-outlined text-amber-600 shrink-0">info</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          After sending payment, your order will be placed with{" "}
          <strong>&quot;Pending Verification&quot;</strong> status. We will confirm
          receipt within 24 hours.
        </p>
      </div>
    </div>
  );
}
