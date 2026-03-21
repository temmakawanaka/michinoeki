import Link from "next/link";

import type { FeaturedStation } from "@/lib/content/home-highlights";

import { InfoChip } from "../ui/info-chip";
import { SectionHeading } from "../ui/section-heading";

type FeaturedStationsSectionProps = {
  items: FeaturedStation[];
};

export function FeaturedStationsSection({ items }: FeaturedStationsSectionProps) {
  return (
    <section aria-label="今週のおすすめ道の駅" className="grid gap-6">
      <SectionHeading
        eyebrow="おすすめ"
        title="今週のおすすめ道の駅"
        description="検索の前に眺めて気分が上がる、週末の寄り道候補を集めました。"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.slug}
            className="h-full rounded-[32px] border border-black/8 bg-white/80 p-4 shadow-[0_20px_60px_rgba(23,33,26,0.08)]"
          >
            <Link className="grid h-full gap-4 no-underline" href={`/stations/${item.slug}`}>
              <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,rgba(217,237,247,0.92),rgba(247,241,227,0.96))] p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[color:var(--color-sky-deep)]">
                  <span>{item.prefecture}</span>
                  <span className="text-black/25">•</span>
                  <span>{item.regionLabel}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">{item.name}</h3>
                <p className="mt-3 text-base leading-7 text-[color:var(--color-ink)]">{item.highlight}</p>
              </div>

              <div className="grid gap-4 px-1 pb-1">
                <p className="text-sm leading-6 text-[color:var(--color-ink-muted)]">{item.detail}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <InfoChip key={tag} label={index === 0 ? "気分" : "寄り道"} value={tag} />
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
