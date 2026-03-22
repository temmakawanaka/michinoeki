import Link from "next/link";

import type { FeaturedEvent } from "@/lib/content/home-highlights";

import { InfoChip } from "../ui/info-chip";
import { SectionHeading } from "../ui/section-heading";

type FeaturedEventsSectionProps = {
  items: FeaturedEvent[];
};

export function FeaturedEventsSection({ items }: FeaturedEventsSectionProps) {
  return (
    <section aria-label="今週の話題" className="grid gap-6">
      <SectionHeading
        eyebrow="話題"
        title="今週の話題"
        description="まずは実際に見に行ける駅の話題から並べて、旅のきっかけをやさしく増やします。"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={`${item.stationName}-${item.title}`}
            className="grid gap-4 rounded-[30px] border border-[color:var(--color-sky-deep)]/12 bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_18px_48px_rgba(23,33,26,0.07)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[rgba(41,95,143,0.12)] px-3 py-1 text-xs font-semibold tracking-[0.22em] text-[color:var(--color-sky-deep)]">
                {item.dateLabel}
              </span>
              <span className="text-sm font-medium text-[color:var(--color-clay)]">{item.prefecture}</span>
            </div>

            <div className="grid gap-2">
              <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">{item.title}</h3>
              <p className="text-sm font-medium text-[color:var(--color-ink)]/76">{item.stationName}</p>
            </div>

            <p className="text-sm leading-6 text-[color:var(--color-ink-muted)]">{item.summary}</p>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <InfoChip key={tag} label="話題" value={tag} />
              ))}
            </div>

            <Link
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-sky-deep)] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-[color:var(--color-ink)]"
              href={item.href}
            >
              駅の詳細を見る
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
