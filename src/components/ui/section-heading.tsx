import type { ElementType } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function SectionHeading({ eyebrow, title, description, level = 2 }: SectionHeadingProps) {
  const Heading = `h${level}` as ElementType;

  return (
    <div className="grid gap-2">
      <p className="text-xs font-medium tracking-[0.28em] text-[color:var(--color-moss)]">{eyebrow}</p>
      <Heading className="text-3xl font-semibold tracking-tight text-[color:var(--color-ink)]">{title}</Heading>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-ink-muted)]">{description}</p>
      ) : null}
    </div>
  );
}