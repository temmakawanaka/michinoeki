import Link from "next/link";

import type { PrefectureEntry } from "@/lib/content/home-highlights";

import { SectionHeading } from "../ui/section-heading";

type PrefectureEntrySectionProps = {
  items: PrefectureEntry[];
};

export function PrefectureEntrySection({ items }: PrefectureEntrySectionProps) {
  return (
    <section aria-label="都道府県から探す" className="grid gap-6">
      <SectionHeading
        eyebrow="都道府県から"
        title="行き先の空気から探したいときに"
        description="全国をいくつかの入口からたどれるようにして、検索だけに頼らない回遊を支えます。"
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.prefecture}
              className="grid gap-3 rounded-[28px] border border-black/8 bg-white/82 p-5 no-underline shadow-[0_16px_44px_rgba(23,33,26,0.06)] transition hover:translate-y-[-2px]"
              href={`/search?prefecture=${encodeURIComponent(item.prefecture)}`}
            >
              <div className="grid gap-1">
                <p className="text-sm font-semibold tracking-[0.2em] text-[color:var(--color-moss)]">{item.prefecture}</p>
                <h3 className="text-lg font-semibold text-[color:var(--color-ink)]">{item.region}</h3>
              </div>
              <p className="text-sm leading-6 text-[color:var(--color-ink-muted)]">{item.note}</p>
            </Link>
          ))}
        </div>

        <aside className="grid gap-4 rounded-[32px] border border-[color:var(--color-sky-deep)]/15 bg-[linear-gradient(180deg,rgba(217,237,247,0.58),rgba(247,241,227,0.9))] p-6 shadow-[0_18px_52px_rgba(23,33,26,0.07)]">
          <p className="text-xs font-semibold tracking-[0.28em] text-[color:var(--color-sky-deep)]">全国から入口を選ぶ</p>
          <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">まず地域を決めてから、気になる駅を絞り込む。</h3>
          <p className="text-sm leading-7 text-[color:var(--color-ink-muted)]">
            都道府県から入ると、海沿いのルートや高原ドライブなど、週末の空気感に合わせて候補を探しやすくなります。
          </p>
          <div className="grid gap-3 rounded-[24px] bg-white/72 p-4 text-sm text-[color:var(--color-ink)]/76">
            <p>検索で迷ったら「静岡県」「北海道」などの地名から入るのもおすすめです。</p>
            <p>気になる駅が見つかったら、そのまま営業時間や定休日の確認へ進めます。</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
