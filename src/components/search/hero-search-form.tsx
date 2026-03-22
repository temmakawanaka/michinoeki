const quickStarts = ["駅名から探せる", "営業時間を確認", "週末の寄り道先を見る"];

export function HeroSearchForm() {
  return (
    <form
      action="/search"
      className="grid gap-4 rounded-[28px] border border-white/60 bg-white/88 p-5 shadow-[0_18px_60px_rgba(23,33,26,0.12)] backdrop-blur"
    >
      <div className="grid gap-3">
        <label className="text-sm font-semibold text-[color:var(--color-ink)]" htmlFor="home-station-search">
          駅名・地名・住所から検索
        </label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            aria-label="道の駅検索"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-[color:var(--color-ink)] outline-none ring-0 transition placeholder:text-black/40 focus:border-[color:var(--color-sky-deep)] focus:shadow-[0_0_0_4px_rgba(41,95,143,0.12)]"
            id="home-station-search"
            name="q"
            placeholder="駅名・地名・住所で検索"
            type="search"
          />
          <button
            className="rounded-2xl bg-[linear-gradient(135deg,var(--color-ink),var(--color-sky-deep))] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(23,33,26,0.18)] transition hover:translate-y-[-1px]"
            type="submit"
          >
            道の駅を検索する
          </button>
        </div>
      </div>

      <p className="text-sm leading-6 text-[color:var(--color-ink-muted)]">
        営業時間や定休日を確かめたいときも、まずはここから探せます。
      </p>

      <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-ink)]/72">
        {quickStarts.map((item) => (
          <span key={item} className="rounded-full bg-[color:var(--color-paper)] px-3 py-1.5">
            {item}
          </span>
        ))}
      </div>
    </form>
  );
}
