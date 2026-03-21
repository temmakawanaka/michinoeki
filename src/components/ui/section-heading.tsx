type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-medium tracking-[0.28em] text-[color:var(--color-moss)]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-ink)]">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-ink-muted)]">{description}</p>
      ) : null}
    </div>
  );
}
