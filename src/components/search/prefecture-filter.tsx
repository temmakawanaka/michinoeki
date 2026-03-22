import Link from "next/link";

const PREFECTURES = ["北海道", "長野県", "岐阜県", "東京都", "愛知県", "神奈川県", "兵庫県", "静岡県"];

type PrefectureFilterProps = {
  selected?: string;
  query?: string;
};

function buildSearchHref(query?: string, prefecture?: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (prefecture) {
    params.set("prefecture", prefecture);
  }

  const search = params.toString();
  return search ? `/search?${search}` : "/search";
}

export function PrefectureFilter({ selected, query }: PrefectureFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {selected ? (
        <Link
          className="rounded-full px-3 py-1 text-xs font-medium no-underline bg-[color:var(--color-paper)] text-[color:var(--color-ink)]"
          href={buildSearchHref(query)}
        >
          都道府県を解除
        </Link>
      ) : null}

      {PREFECTURES.map((prefecture) => {
        const active = prefecture === selected;

        return (
          <Link
            key={prefecture}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-medium no-underline ${active ? "bg-moss text-white" : "bg-black/5 text-black/70"}`}
            href={buildSearchHref(query, prefecture)}
          >
            {prefecture}
          </Link>
        );
      })}
    </div>
  );
}
