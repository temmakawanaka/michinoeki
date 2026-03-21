import { HeroSearchForm } from "@/components/search/hero-search-form";

export default function HomePage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 py-12">
      <div className="grid gap-4">
        <p className="text-sm uppercase tracking-[0.24em] text-moss">全国の道の駅ディレクトリ</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink">全国の道の駅を、ひとつの入口から探せるようにします。</h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          駅名、都道府県、住所から道の駅を検索し、営業時間や定休日などの基本情報をすぐに確認できます。
        </p>
      </div>
      <HeroSearchForm />
    </section>
  );
}