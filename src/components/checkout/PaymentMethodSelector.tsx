"use client";

import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/data/payment-config";

interface Props {
  selected: PaymentMethodId;
  onSelect: (method: PaymentMethodId) => void;
}

export default function PaymentMethodSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {PAYMENT_METHODS.map((method) => {
        const isActive = selected === method.id;
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
              isActive
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                : "border-surface-variant bg-white dark:bg-surface-container hover:border-outline hover:shadow-md hover:scale-[1.01]"
            }`}
          >
            {/* Radio indicator */}
            <div
              className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isActive ? "border-primary" : "border-surface-variant"
              }`}
            >
              {isActive && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-scale-in" />
              )}
            </div>

            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{method.icon}</span>
            </div>

            {/* Label */}
            <span
              className={`font-bold text-sm transition-colors ${
                isActive ? "text-primary" : "text-on-surface"
              }`}
            >
              {method.label}
            </span>

            {/* Description */}
            <span className="text-xs text-on-surface-variant text-center leading-relaxed">
              {method.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
