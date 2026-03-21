export type FeaturedStation = {
  slug: string;
  name: string;
  prefecture: string;
  regionLabel: string;
  highlight: string;
  detail: string;
  tags: string[];
};

export type FeaturedEvent = {
  title: string;
  stationName: string;
  prefecture: string;
  dateLabel: string;
  summary: string;
  tags: string[];
};

export type PrefectureEntry = {
  prefecture: string;
  region: string;
  note: string;
};

export const featuredStations: FeaturedStation[] = [
  {
    slug: "michinoeki-fuji",
    name: "道の駅 富士",
    prefecture: "静岡県",
    regionLabel: "富士川沿いでひと息つける実在スポット",
    highlight: "海と富士山の気配を感じながら、移動の合間に立ち寄りやすい一駅です。",
    detail: "営業時間や駐車場情報も確認できるので、東名周辺の休憩地点を探す入口として実用的に使えます。",
    tags: ["実在ページへ移動できる", "静岡ドライブの途中向き"],
  },
];

export const featuredEvents: FeaturedEvent[] = [
  {
    title: "春のいちごフェア",
    stationName: "道の駅 みのりの郷東金",
    prefecture: "千葉県",
    dateLabel: "3月下旬の週末",
    summary: "直売所の朝採れいちごと限定スイーツを楽しめる、春らしい立ち寄りイベントです。",
    tags: ["旬の味覚", "家族で立ち寄りたい"],
  },
  {
    title: "夕景マルシェ",
    stationName: "道の駅 夕陽が丘そとめ",
    prefecture: "長崎県",
    dateLabel: "毎週土曜の夕方",
    summary: "海に沈む夕日を眺めながら、焼き菓子や海産物の小さなマルシェを楽しめます。",
    tags: ["景色も主役", "夕方ドライブ向き"],
  },
  {
    title: "山の恵み感謝市",
    stationName: "道の駅 ななもり清見",
    prefecture: "岐阜県",
    dateLabel: "4月前半",
    summary: "山菜や地元加工品が並び、春の飛騨らしい味と香りをまとめて味わえる企画です。",
    tags: ["直売所が楽しい", "季節を感じる"],
  },
];

export const prefectureEntries: PrefectureEntry[] = [
  {
    prefecture: "静岡県",
    region: "富士周辺の寄り道から始める",
    note: "seed 済みデータで実際に検索結果へ進める入口です。",
  },
];
