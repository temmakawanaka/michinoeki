import { FeaturedEventsSection } from "@/components/home/featured-events-section";
import { FeaturedStationsSection } from "@/components/home/featured-stations-section";
import { HeroVisual } from "@/components/home/hero-visual";
import { PrefectureEntrySection } from "@/components/home/prefecture-entry-section";
import { HeroSearchForm } from "@/components/search/hero-search-form";
import { featuredEvents, featuredStations, prefectureEntries } from "@/lib/content/home-highlights";

const heroHighlights = ["駅名からすぐ検索", "都道府県で見つける", "イベントから寄り道"];

export default function HomePage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 py-8 md:py-10 lg:gap-16">
      <section className="relative overflow-hidden rounded-[40px] border border-white/40 bg-[linear-gradient(135deg,rgba(247,241,227,0.94),rgba(217,237,247,0.9))] px-6 py-8 shadow-[0_26px_90px_rgba(23,33,26,0.12)] md:px-8 lg:px-10 lg:py-10">
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(245,179,92,0.25),transparent_70%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-center">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <p className="text-sm font-semibold tracking-[0.28em] text-[color:var(--color-moss)]">週末の寄り道を探す</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[color:var(--color-ink)] md:text-5xl">
                全国の道の駅を、
                <br className="hidden md:block" />
                ひとつの入口から探せる。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--color-ink-muted)] md:text-lg">
                駅名、都道府県、住所から道の駅をすばやく検索しながら、今週のおすすめやイベントから旅のきっかけも見つけられます。
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-[color:var(--color-ink)]/78">
              {heroHighlights.map((item) => (
                <span key={item} className="rounded-full border border-white/50 bg-white/70 px-3 py-1.5 shadow-sm shadow-black/5">
                  {item}
                </span>
              ))}
            </div>

            <HeroSearchForm />
          </div>

          <HeroVisual />
        </div>
      </section>

      <FeaturedStationsSection items={featuredStations} />
      <FeaturedEventsSection items={featuredEvents} />
      <PrefectureEntrySection items={prefectureEntries} />
    </div>
  );
}
