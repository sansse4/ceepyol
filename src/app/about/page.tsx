import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = {
  title: "About Us",
  description: "Learn about ceepyol's mission to make premium tech accessible and sustainable.",
};

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-headline)] mb-6">
          Premium Tech,{" "}
          <span className="text-primary">Responsibly Curated</span>
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          ceepyol is on a mission to make premium technology accessible to everyone while reducing
          electronic waste. We believe great tech shouldn&apos;t cost the earth — literally.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: "verified",
            title: "Quality Assured",
            desc: "Every device passes a rigorous 70+ point inspection. We only sell products that meet our highest standards.",
          },
          {
            icon: "recycling",
            title: "Sustainable Choice",
            desc: "By choosing refurbished tech, you help reduce e-waste and the environmental impact of manufacturing new devices.",
          },
          {
            icon: "shield",
            title: "Buyer Protection",
            desc: "12-month warranty, 30-day returns, and free shipping on orders over $100. Shop with confidence.",
          },
        ].map((value) => (
          <div
            key={value.title}
            className="bg-surface-container-lowest dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">{value.icon}</span>
            </div>
            <h3 className="font-bold text-xl mb-3">{value.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-primary to-[#004d1a] rounded-3xl p-12 lg:p-16 text-white text-center mb-20">
        <h2 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-12">
          Our Impact in Numbers
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "500K+", label: "Happy Customers" },
            { value: "5+ Tons", label: "E-waste Saved" },
            { value: "4.8/5", label: "Average Rating" },
            { value: "70K+", label: "Reviews" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-emerald-200 text-sm font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-6">
          Our Story
        </h2>
        <div className="text-on-surface-variant leading-relaxed space-y-4">
          <p>
            ceepyol was founded with a simple idea: premium technology shouldn&apos;t be disposable.
            Every year, millions of perfectly functional devices are discarded, contributing to the
            growing e-waste crisis.
          </p>
          <p>
            We partner exclusively with certified refurbishers who share our commitment to quality.
            Each device undergoes thorough testing, repair, and cosmetic restoration to ensure
            it meets the highest standards.
          </p>
          <p>
            By choosing ceepyol, you&apos;re not just getting a great deal — you&apos;re making a
            conscious choice to reduce waste and support a more sustainable tech ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
