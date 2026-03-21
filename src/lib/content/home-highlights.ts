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
    slug: "michinoeki-fujiyoshida",
    name: "道の駅 富士吉田",
    prefecture: "山梨県",
    regionLabel: "富士山の玄関口",
    highlight: "朝の富士山を眺めながら地元うどんでひと休み。",
    detail: "湧水スポットやレーダードーム館と合わせて、半日ドライブの寄り道先にしやすい一駅です。",
    tags: ["景色が気持ちいい", "朝ドライブ向き"],
  },
  {
    slug: "michinoeki-shonan",
    name: "道の駅 湘南ちがさき",
    prefecture: "神奈川県",
    regionLabel: "海風を感じる新しい寄り道",
    highlight: "海辺の空気をまとった週末ルートに、軽やかに組み込みたい新顔。",
    detail: "湘南エリアの買い物や海岸散歩とつなぎやすく、短い外出でも旅気分を足せます。",
    tags: ["海沿いの気分", "新しい駅を試したい"],
  },
  {
    slug: "michinoeki-kawaba-denen-plaza",
    name: "川場田園プラザ",
    prefecture: "群馬県",
    regionLabel: "高原でゆっくり過ごす",
    highlight: "パンや地場野菜を目当てに、長めの滞在を楽しみたい人気スポット。",
    detail: "家族での食事休憩にも使いやすく、景色と直売所の両方を満喫しやすい構成です。",
    tags: ["買い物も楽しめる", "家族のおでかけ向き"],
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
    prefecture: "北海道",
    region: "道北から道東までロングドライブへ",
    note: "広い景色と距離感を楽しみたい週末旅に。",
  },
  {
    prefecture: "宮城県",
    region: "海と温泉をつなぐ東北の入口",
    note: "仙台近郊から足を延ばす寄り道候補に。",
  },
  {
    prefecture: "栃木県",
    region: "高原と温泉をめぐる北関東ルート",
    note: "那須や日光方面の外出計画と相性良好。",
  },
  {
    prefecture: "静岡県",
    region: "海沿いも山沿いも選びやすい",
    note: "富士山周辺や駿河湾ドライブの起点に。",
  },
  {
    prefecture: "京都府",
    region: "街歩きの先で、もうひと寄り道",
    note: "丹後や南山城へ向かう日帰り旅に。",
  },
  {
    prefecture: "広島県",
    region: "瀬戸内の穏やかな寄り道",
    note: "しまなみ街道周辺の立ち寄り先探しに。",
  },
  {
    prefecture: "愛媛県",
    region: "海と柑橘の気配を楽しむ",
    note: "港町と山あいの表情差を味わえます。",
  },
  {
    prefecture: "熊本県",
    region: "阿蘇方面へ抜ける週末ルート",
    note: "景色重視の外出計画にも合わせやすい入口です。",
  },
];
