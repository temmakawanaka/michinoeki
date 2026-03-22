type InfoChipProps = {
  label: string;
  value: string;
};

export function InfoChip({ label, value }: InfoChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-sky-deep)]/15 bg-[color:var(--color-paper)] px-3 py-1.5 text-sm text-[color:var(--color-ink)] shadow-sm shadow-black/5">
      <span className="text-[0.65rem] font-medium tracking-[0.24em] text-[color:var(--color-moss)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
