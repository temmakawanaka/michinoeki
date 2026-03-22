import Link from "next/link";

const PREFECTURES = ["北海道", "長野県", "岐阜県", "東京都", "愛知県", "神奈川県", "兵庫県", "静岡県"];

type PrefectureFilterProps = {
  selected?: string;
  query?: string;
};

export function PrefectureFilter({ selected, query }: PrefectureFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PREFECTURES.map((prefecture) => {
        const active = prefecture === selected;
        const params = new URLSearchParams();

        if (query) {
          params.set("q", query);
        }

        params.set("prefecture", prefecture);

        return (
          <Link
            key={prefecture}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-medium no-underline ${active ? "bg-moss text-white" : "bg-black/5 text-black/70"}`}
            href={`/search?${params.toString()}`}
          >
            {prefecture}
          </Link>
        );
      })}
    </div>
  );
}
