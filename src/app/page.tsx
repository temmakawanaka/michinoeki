import { HeroSearchForm } from "@/components/search/hero-search-form";

export default function HomePage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 py-12">
      <div className="grid gap-4">
        <p className="text-sm uppercase tracking-[0.24em] text-moss">Nationwide Michi-no-Eki Directory</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink">
          Find roadside stations across Japan from one calm, searchable starting point.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          Search by station name, prefecture, or address and open each station page for the core information you need.
        </p>
      </div>
      <HeroSearchForm />
    </section>
  );
}
