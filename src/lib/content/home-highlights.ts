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
  href: string;
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
    title: "富士川寄り道プラン",
    stationName: "道の駅 富士",
    prefecture: "静岡県",
    dateLabel: "今週のおすすめ",
    summary: "海沿いドライブの途中で立ち寄りやすく、営業時間や設備もそのまま確認できる実在駅の話題です。",
    tags: ["実在ページへ移動できる", "景色を楽しむ"],
    href: "/stations/michinoeki-fuji",
  },
];

export const prefectureEntries: PrefectureEntry[] = [
  {
    prefecture: "静岡県",
    region: "富士周辺の寄り道から始める",
    note: "seed 済みデータで実際に検索結果へ進める入口です。",
  },
];
