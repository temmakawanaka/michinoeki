import { featuredEvents, featuredStations } from "@/lib/content/home-highlights";

export function HeroVisual() {
  const [leadStation, secondaryStation] = featuredStations;
  const [leadEvent] = featuredEvents;

  return (
    <div
      aria-hidden="true"
      className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/40 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(217,237,247,0.72))] p-6 shadow-[0_24px_80px_rgba(23,33,26,0.12)]"
    >
      <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-[radial-gradient(circle,rgba(245,179,92,0.35),transparent_65%)]" />
      <div className="absolute -right-16 top-20 h-40 w-40 rounded-full bg-[rgba(192,107,62,0.16)] blur-2xl" />
      <div className="absolute -left-10 bottom-8 h-28 w-44 rounded-full bg-[rgba(41,95,143,0.14)] blur-2xl" />

      <div className="relative z-10 grid h-full gap-4">
        <div className="flex items-center justify-between rounded-[26px] bg-[linear-gradient(135deg,rgba(41,95,143,0.94),rgba(23,33,26,0.88))] px-5 py-4 text-white shadow-lg shadow-[rgba(23,33,26,0.18)]">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-white/72">週末ドライブノート</p>
            <p className="mt-2 text-lg font-semibold">週末の寄り道を、ひとつ先まで想像する。</p>
          </div>
          <div className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white/80">旅の空気</div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/50 bg-white/90 p-5 shadow-md shadow-black/10">
            <p className="text-xs font-semibold tracking-[0.28em] text-[color:var(--color-moss)]">注目の一駅</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">{leadStation.name}</h2>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-sky-deep)]">{leadStation.regionLabel}</p>
            <p className="mt-4 text-sm leading-6 text-[color:var(--color-ink-muted)]">{leadStation.highlight}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-[color:var(--color-ink)]/75">
              <span className="rounded-full bg-[color:var(--color-paper)] px-3 py-1">{leadStation.prefecture}</span>
              <span className="rounded-full bg-[rgba(245,179,92,0.22)] px-3 py-1">{leadStation.tags[0]}</span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/50 bg-white/82 p-4 shadow-md shadow-black/10">
              <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--color-clay)]">今の話題</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--color-ink)]">{leadEvent.title}</p>
              <p className="mt-1 text-sm text-[color:var(--color-ink-muted)]">{leadEvent.stationName}</p>
              <p className="mt-3 text-sm text-[color:var(--color-ink)]/75">{leadEvent.dateLabel}</p>
            </div>

            <div className="rounded-[24px] border border-dashed border-[color:var(--color-sky-deep)]/25 bg-[rgba(247,241,227,0.82)] p-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--color-moss)]">次の寄り道候補</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--color-ink)]">{secondaryStation.name}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-ink-muted)]">海沿いの空気や買い物気分など、検索の前に旅のきっかけを見つけられる構成です。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
