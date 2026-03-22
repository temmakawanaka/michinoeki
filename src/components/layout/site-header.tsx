import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--color-clay)]/15 bg-[color:var(--color-paper)]/90 px-6 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-clay),var(--color-sun))] text-sm font-semibold text-white shadow-md shadow-[color:var(--color-clay)]/20"
          >
            道
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-[color:var(--color-moss)]">全国の道の駅をめぐる入口</p>
            <Link className="mt-1 block text-2xl font-semibold tracking-tight text-[color:var(--color-ink)] no-underline" href="/">
              道の駅ガイド
            </Link>
          </div>
        </div>
        <p className="hidden text-sm text-[color:var(--color-ink)]/70 md:block">寄り道したくなる駅を、やさしく探せます。</p>
      </div>
    </header>
  );
}
