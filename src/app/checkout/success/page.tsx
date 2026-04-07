import Link from "next/link";

export const metadata = {
  title: "Order Confirmed",
};

export default function CheckoutSuccessPage() {
  const orderNumber = `TB-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="max-w-screen-md mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>

      <h1 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-3">
        Order Confirmed!
      </h1>
      <p className="text-on-surface-variant text-lg mb-2">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="text-sm text-on-surface-variant mb-8">
        Order number: <span className="font-bold text-on-surface">{orderNumber}</span>
      </p>

      <div className="bg-white dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant mb-8 text-left">
        <h3 className="font-bold mb-4">What happens next?</h3>
        <div className="space-y-4">
          {[
            { icon: "mail", title: "Confirmation Email", desc: "You'll receive an email with your order details." },
            { icon: "inventory_2", title: "Processing", desc: "We'll carefully inspect and prepare your device." },
            { icon: "local_shipping", title: "Shipping", desc: "Your order will be shipped with tracking within 1-2 business days." },
          ].map((step) => (
            <div key={step.title} className="flex gap-4">
              <span className="material-symbols-outlined text-primary shrink-0">{step.icon}</span>
              <div>
                <p className="font-bold text-sm">{step.title}</p>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="px-8 py-4 font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
