export default function SpecsTable({ specs }: { specs: { label: string; value: string }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-surface-variant">
      {specs.map((spec, i) => (
        <div
          key={spec.label}
          className={`flex flex-col sm:flex-row px-4 sm:px-6 py-3 sm:py-4 text-sm gap-0.5 sm:gap-0 ${
            i % 2 === 0 ? "bg-surface-container-low" : "bg-white dark:bg-surface-container"
          }`}
        >
          <span className="w-full sm:w-40 shrink-0 font-bold text-on-surface-variant text-xs sm:text-sm">{spec.label}</span>
          <span className="text-on-surface">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}
