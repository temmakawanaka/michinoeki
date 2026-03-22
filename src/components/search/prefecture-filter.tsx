const PREFECTURES = ["北海道", "長野県", "岐阜県", "東京都", "愛知県", "神奈川県", "兵庫県", "静岡県"];

export function PrefectureFilter({ selected }: { selected?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PREFECTURES.map((prefecture) => {
        const active = prefecture === selected;
        return (
          <span
            key={prefecture}
            className={`rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-moss text-white" : "bg-black/5 text-black/70"}`}
          >
            {prefecture}
          </span>
        );
      })}
    </div>
  );
}
