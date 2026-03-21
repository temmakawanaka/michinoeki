export function HeroSearchForm() {
  return (
    <form action="/search" className="grid gap-3 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm md:grid-cols-[1fr_auto]">
      <input
        aria-label="Search"
        className="w-full rounded-2xl border border-black/10 px-4 py-3 text-base"
        name="q"
        placeholder="Search by station, prefecture, or address"
        type="search"
      />
      <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white" type="submit">
        Search
      </button>
    </form>
  );
}
