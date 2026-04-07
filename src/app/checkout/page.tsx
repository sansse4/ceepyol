"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/lib/store/cart";

const steps = ["Shipping", "Payment", "Review"];

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
    country: "US",
  });
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

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
        <h2 className="text-xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-on-surface-variant mb-6">Add some products before checking out.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  function handlePlaceOrder() {
    clearCart();
    router.push("/checkout/success");
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

      <h1 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-6 sm:mb-8">
        Secure Checkout
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
        {/* Form */}
        <div className="flex-1">
          {/* Shipping Step */}
          {currentStep === 0 && (
            <div className="bg-white dark:bg-surface-container rounded-2xl p-5 sm:p-8 shadow-sm border border-surface-variant">
              <h2 className="font-bold text-lg sm:text-xl mb-5 sm:mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={shipping.firstName}
                  onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={shipping.lastName}
                  onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="State"
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="flex-1 px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
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
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant">
              <h2 className="font-bold text-xl mb-6">Payment Method</h2>
              <div className="flex gap-3 mb-6">
                {["VISA", "MC", "AMEX"].map((card) => (
                  <div
                    key={card}
                    className="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface-variant"
                  >
                    {card}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Name on Card"
                  value={payment.nameOnCard}
                  onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                    className="flex-1 px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={payment.cvv}
                    onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                    className="w-28 px-4 py-3 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-8 py-3 text-sm font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant">
              <h2 className="font-bold text-xl mb-6">Order Review</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-surface-variant last:border-0">
                      <div className="w-16 h-16 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                        <Image
                          src={item.productImage || ""}
                          alt={item.productName}
                          width={48}
                          height={48}
                          className="w-12 object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-on-surface-variant">
                          {item.selectedColor} {item.selectedStorage && `/ ${item.selectedStorage}`} x{item.quantity}
                        </p>
                      </div>
                      <span className="font-bold">${(item.unitPrice * item.quantity).toLocaleString('en-US')}.00</span>
                    </div>
                  ))}
              </div>

              {/* Shipping Info */}
              <div className="bg-surface-container-low rounded-xl p-4 mb-6 text-sm">
                <p className="font-bold mb-1">Shipping to:</p>
                <p className="text-on-surface-variant">
                  {shipping.firstName} {shipping.lastName}, {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 text-sm font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">lock</span>
                  Place Order - ${total.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-[180px] bg-white dark:bg-surface-container rounded-2xl p-6 shadow-sm border border-surface-variant">
            <h3 className="font-bold mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal ({itemCount} items)</span>
                <span className="font-semibold">${subtotal.toLocaleString('en-US')}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className={`font-semibold ${shippingCost === 0 ? "text-primary" : ""}`}>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-surface-variant pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
