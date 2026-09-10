<script setup lang="ts">
import { computed, ref } from "vue";

type StationSummary = {
  slug: string;
  name: string;
  prefecture: string;
  address: string;
  openingHours?: string | null;
  closingDays?: string | null;
  websiteUrl?: string | null;
  hasShop?: boolean;
  hasWifi?: boolean;
  distanceKm?: number | null;
};

type Specialty = {
  id?: string;
  name: string;
  description?: string | null;
  category?: string | null;
  priceLabel?: string | null;
  locationLabel?: string | null;
  seasonLabel?: string | null;
  officialUrl?: string | null;
};

type StationEvent = {
  id: string;
  title: string;
  summary: string;
  dateLabel: string;
  category: string;
  important?: boolean;
  isDemo?: boolean;
  officialUrl?: string | null;
};

type StationDetail = StationSummary & {
  latitude?: number | null;
  longitude?: number | null;
  parking?: { regularCars?: number | null; accessibleCars?: number | null; largeVehicles?: number | null } | null;
  specialties?: Specialty[];
  events?: StationEvent[];
};

const FAVORITES_KEY = "michinoeki:favorites:v1";

function loadFavorites() {
  try {
    const value = localStorage.getItem(FAVORITES_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

const query = ref("");
const loading = ref(false);
const locationMessage = ref("");
const selected = ref<StationDetail | null>(null);
const savedSlugs = ref<string[]>(loadFavorites());
const savedOnly = ref(false);

const demoStations: StationDetail[] = [
  {
    slug: "michinoeki-fuji",
    name: "道の駅 富士",
    prefecture: "静岡県",
    address: "静岡県富士市五貫島669-1",
    openingHours: "09:00〜18:00",
    closingDays: "年中無休",
    websiteUrl: "https://www.city.fuji.shizuoka.jp/",
    hasShop: true,
    hasWifi: true,
    parking: { regularCars: 52, accessibleCars: 2, largeVehicles: 12 },
    specialties: [
      { name: "しらす丼", category: "グルメ", description: "駿河湾のしらすを気軽に味わえる、ご当地らしい一品。", priceLabel: "価格は現地で確認", locationLabel: "食事処" },
      { name: "静岡茶", category: "特産品", description: "旅のお土産にも選びやすい静岡の定番。", seasonLabel: "通年", locationLabel: "売店" },
    ],
    events: [
      { id: "fuji-autumn", title: "秋の味覚フェア", summary: "旬の農産物や地域の味を楽しむイベント表示のサンプルです。", dateLabel: "9月12日〜13日", category: "フェア", isDemo: true },
    ],
  },
  {
    slug: "kakegawa",
    name: "道の駅 掛川",
    prefecture: "静岡県",
    address: "静岡県掛川市八坂882-1",
    openingHours: "09:00〜17:00",
    closingDays: "要確認",
    hasShop: true,
    hasWifi: true,
    specialties: [
      { name: "深蒸し茶", category: "特産品", description: "掛川らしいお茶を探したい人向け。", locationLabel: "直売所" },
      { name: "地元野菜", category: "農産物", description: "季節ごとの旬を見つける楽しさがあります。", seasonLabel: "季節により変動" },
    ],
    events: [
      { id: "kakegawa-harvest", title: "朝採れ野菜マルシェ", summary: "生産者から届く旬の野菜を紹介するイベント表示のサンプルです。", dateLabel: "9月19日", category: "マルシェ", isDemo: true },
    ],
  },
  {
    slug: "shiomizaka",
    name: "道の駅 潮見坂",
    prefecture: "静岡県",
    address: "静岡県湖西市白須賀1896-2",
    openingHours: "08:00〜19:00",
    closingDays: "要確認",
    hasShop: true,
    hasWifi: true,
    specialties: [
      { name: "しらす", category: "海鮮", description: "浜名湖・遠州エリアらしい海の味覚。", locationLabel: "売店・食事処" },
      { name: "足湯", category: "体験", description: "ドライブ休憩に立ち寄りやすい人気ポイント。" },
    ],
    events: [
      { id: "shiomizaka-sea", title: "海の恵み特集", summary: "地域の海産物をピックアップする企画表示のサンプルです。", dateLabel: "9月下旬", category: "特集", isDemo: true },
    ],
  },
];

const stations = ref<StationDetail[]>(demoStations);
const filteredStations = computed(() => {
  const q = query.value.trim().toLowerCase();
  return stations.value.filter((station) => {
    if (savedOnly.value && !savedSlugs.value.includes(station.slug)) return false;
    if (!q) return true;
    return [
      station.name,
      station.prefecture,
      station.address,
      ...(station.specialties ?? []).map((item) => item.name),
      ...(station.events ?? []).map((event) => event.title),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
});

const featuredEvents = computed(() =>
  demoStations
    .flatMap((station) => (station.events ?? []).map((event) => ({ station, event })))
    .slice(0, 3),
);

function isSaved(slug: string) {
  return savedSlugs.value.includes(slug);
}

function persistFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(savedSlugs.value));
}

function toggleSaved(station: StationDetail) {
  savedSlugs.value = isSaved(station.slug)
    ? savedSlugs.value.filter((slug) => slug !== station.slug)
    : [...savedSlugs.value, station.slug];
  persistFavorites();
}

function toggleSavedOnly() {
  selected.value = null;
  savedOnly.value = !savedOnly.value;
  query.value = "";
}

function mapSearchUrl(station: StationDetail) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${station.name} ${station.address}`)}`;
}

function mapEmbedUrl(station: StationDetail) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${station.name} ${station.address}`)}&output=embed`;
}

function searchByKeyword(keyword: string) {
  savedOnly.value = false;
  query.value = keyword;
  document.querySelector(".content-section")?.scrollIntoView({ behavior: "smooth" });
}

async function searchStations() {
  loading.value = true;
  selected.value = null;
  savedOnly.value = false;
  try {
    const response = await fetch(`/api/stations?q=${encodeURIComponent(query.value)}`);
    if (!response.ok) throw new Error("API unavailable");
    const data = (await response.json()) as { items?: StationSummary[] };
    if (data.items?.length) stations.value = data.items;
  } catch {
    // API未起動時もUIを確認できるようデモデータを維持する。
  } finally {
    loading.value = false;
  }
}

async function openStation(station: StationDetail) {
  selected.value = station;
  window.scrollTo({ top: 0, behavior: "smooth" });
  try {
    const response = await fetch(`/api/stations/${encodeURIComponent(station.slug)}`);
    if (!response.ok) return;
    const detail = (await response.json()) as StationDetail;
    selected.value = {
      ...station,
      ...detail,
      specialties: detail.specialties?.length ? detail.specialties : station.specialties,
      events: detail.events?.length ? detail.events : station.events,
    };
  } catch {
    // デモ表示を継続する。
  }
}

function findNearby() {
  locationMessage.value = "";
  savedOnly.value = false;
  if (!navigator.geolocation) {
    locationMessage.value = "この端末では位置情報を利用できません。";
    return;
  }
  loading.value = true;
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const response = await fetch(`/api/stations/nearby?lat=${coords.latitude}&lng=${coords.longitude}&radiusKm=50&limit=20`);
        if (!response.ok) throw new Error("nearby API unavailable");
        const data = (await response.json()) as { items?: StationDetail[] };
        if (data.items?.length) stations.value = data.items;
        locationMessage.value = data.items?.length ? "現在地に近い順で表示しています。" : "50km以内の道の駅が見つかりませんでした。";
      } catch {
        locationMessage.value = "位置情報は取得できました。公開版API接続後、このまま距離順表示に切り替わります。";
      } finally {
        loading.value = false;
      }
    },
    () => {
      loading.value = false;
      locationMessage.value = "位置情報の利用が許可されませんでした。";
    },
  );
}
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <button class="brand" @click="selected = null; savedOnly = false" aria-label="トップへ戻る">
        <span class="brand-mark">道</span>
        <span><strong>よりみち道の駅</strong><small>旅先の「ちょっと寄りたい」を見つける</small></span>
      </button>
      <button class="saved-button" :class="{ active: savedOnly }" aria-label="行きたいリスト" @click="toggleSavedOnly">
        {{ savedOnly ? '♥' : '♡' }} <span>行きたい</span><b v-if="savedSlugs.length">{{ savedSlugs.length }}</b>
      </button>
    </header>

    <main v-if="!selected">
      <section class="hero">
        <p class="eyebrow">MICHINOEKI GUIDE</p>
        <h1>{{ savedOnly ? '行きたい道の駅を、\n次の旅へ。' : '次の休憩を、\n旅の楽しみに。' }}</h1>
        <p class="hero-copy">{{ savedOnly ? '気になった道の駅はこの端末に保存されます。次のドライブ候補をここから見返せます。' : '基本情報だけでなく、名物・特産品・イベントまで。道の駅を起点に、その土地らしさを探せるガイドです。' }}</p>
        <form v-if="!savedOnly" class="search-box" @submit.prevent="searchStations">
          <input v-model="query" placeholder="道の駅・地域・名物・イベントから探す" aria-label="検索キーワード" />
          <button type="submit">探す</button>
        </form>
        <button v-if="!savedOnly" class="nearby-button" @click="findNearby">◎ 現在地から近い道の駅を探す</button>
        <p v-if="locationMessage && !savedOnly" class="status-message">{{ locationMessage }}</p>
      </section>

      <section v-if="!savedOnly" class="quick-links" aria-label="目的から探す">
        <button @click="searchByKeyword('海鮮')">海鮮</button>
        <button @click="searchByKeyword('お茶')">お茶</button>
        <button @click="searchByKeyword('野菜')">産直</button>
        <button @click="searchByKeyword('足湯')">温泉・足湯</button>
        <button @click="searchByKeyword('イベント')">イベント</button>
      </section>

      <section v-if="!savedOnly" class="content-section event-feature-section">
        <div class="section-heading">
          <div><p class="eyebrow">WHAT'S ON</p><h2>今週末・近日のよりみち</h2></div>
          <span class="demo-label">デモ表示</span>
        </div>
        <div class="event-feature-grid">
          <article v-for="item in featuredEvents" :key="item.event.id" class="event-feature-card" @click="openStation(item.station)">
            <div class="event-date">{{ item.event.dateLabel }}</div>
            <div>
              <span class="category">{{ item.event.category }}</span>
              <h3>{{ item.event.title }}</h3>
              <p>{{ item.event.summary }}</p>
              <small>{{ item.station.name }}</small>
            </div>
          </article>
        </div>
        <p class="demo-note">※ 現在のイベントは画面確認用のサンプルです。公開API接続後に公式情報へ切り替えます。</p>
      </section>

      <section class="content-section">
        <div class="section-heading">
          <div><p class="eyebrow">{{ savedOnly ? 'SAVED' : 'DISCOVER' }}</p><h2>{{ savedOnly ? '行きたい道の駅' : query ? `「${query}」の候補` : 'まず寄ってみたい道の駅' }}</h2></div>
          <span>{{ filteredStations.length }}件</span>
        </div>

        <div v-if="loading" class="loading">情報を読み込んでいます…</div>
        <div v-else-if="savedOnly && filteredStations.length === 0" class="empty-state saved-empty">
          まだ「行きたい」道の駅はありません。気になる道の駅の詳細で♡を押すと、ここに保存できます。
        </div>
        <div v-else class="station-list">
          <article v-for="station in filteredStations" :key="station.slug" class="station-card" @click="openStation(station)">
            <div class="station-visual"><span>{{ station.prefecture.replace(/[都道府県]$/, '') }}</span></div>
            <div class="station-card-body">
              <div class="station-meta-line">
                <p class="prefecture">{{ station.prefecture }}</p>
                <span v-if="station.distanceKm != null" class="distance">現在地から約{{ station.distanceKm }}km</span>
              </div>
              <h3>{{ station.name }}</h3>
              <p class="address">{{ station.address }}</p>
              <div class="tags">
                <span v-if="station.openingHours">{{ station.openingHours }}</span>
                <span v-if="station.hasShop">直売所</span>
                <span v-if="station.hasWifi">Wi‑Fi</span>
                <span v-if="isSaved(station.slug)" class="saved-tag">♥ 行きたい</span>
              </div>
              <div v-if="station.specialties?.length" class="specialty-preview">おすすめ：{{ station.specialties.slice(0, 2).map((s) => s.name).join('・') }}</div>
            </div>
            <span class="card-arrow">→</span>
          </article>
        </div>
      </section>
    </main>

    <main v-else class="detail-page">
      <button class="back-button" @click="selected = null">← 一覧へ戻る</button>
      <section class="detail-hero">
        <p class="prefecture">{{ selected.prefecture }}</p>
        <h1>{{ selected.name }}</h1>
        <p>{{ selected.address }}</p>
        <div class="detail-actions">
          <a v-if="selected.websiteUrl" :href="selected.websiteUrl" target="_blank" rel="noreferrer">公式サイト ↗</a>
          <a :href="mapSearchUrl(selected)" target="_blank" rel="noreferrer" class="secondary-action">地図を開く ↗</a>
          <button :class="{ saved: isSaved(selected.slug) }" @click="toggleSaved(selected)">{{ isSaved(selected.slug) ? '♥ 行きたいに保存済み' : '♡ 行きたい' }}</button>
        </div>
      </section>

      <section class="info-grid">
        <div><small>営業時間</small><strong>{{ selected.openingHours ?? '公式情報を確認' }}</strong></div>
        <div><small>休館日</small><strong>{{ selected.closingDays ?? '公式情報を確認' }}</strong></div>
        <div><small>普通車</small><strong>{{ selected.parking?.regularCars ?? '—' }}<span v-if="selected.parking?.regularCars">台</span></strong></div>
        <div><small>設備</small><strong>{{ [selected.hasShop && '直売所', selected.hasWifi && 'Wi‑Fi'].filter(Boolean).join('・') || '—' }}</strong></div>
      </section>

      <section class="content-section detail-section map-section">
        <div class="section-heading"><div><p class="eyebrow">MAP</p><h2>場所を確認する</h2></div></div>
        <div class="map-frame-wrap">
          <iframe class="map-frame" :src="mapEmbedUrl(selected)" loading="lazy" referrerpolicy="no-referrer-when-downgrade" :title="`${selected.name}の地図`" />
          <div class="map-caption">
            <div><strong>{{ selected.name }}</strong><span>{{ selected.address }}</span></div>
            <a :href="mapSearchUrl(selected)" target="_blank" rel="noreferrer">Google マップで開く →</a>
          </div>
        </div>
      </section>

      <section class="content-section detail-section">
        <div class="section-heading"><div><p class="eyebrow">LOCAL PICKS</p><h2>ここで味わいたい・買いたい</h2></div></div>
        <div v-if="selected.specialties?.length" class="specialty-list">
          <article v-for="item in selected.specialties" :key="item.name" class="specialty-card">
            <span class="category">{{ item.category ?? 'おすすめ' }}</span>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <dl>
              <div v-if="item.priceLabel"><dt>価格</dt><dd>{{ item.priceLabel }}</dd></div>
              <div v-if="item.locationLabel"><dt>場所</dt><dd>{{ item.locationLabel }}</dd></div>
              <div v-if="item.seasonLabel"><dt>時期</dt><dd>{{ item.seasonLabel }}</dd></div>
            </dl>
          </article>
        </div>
        <div v-else class="empty-state">特産品情報はこれから追加予定です。公式サイトの情報と合わせて充実させていきます。</div>
      </section>

      <section class="content-section detail-section">
        <div class="section-heading">
          <div><p class="eyebrow">EVENTS & NEWS</p><h2>イベント・お知らせ</h2></div>
          <span v-if="selected.events?.some((event) => event.isDemo)" class="demo-label">デモ表示</span>
        </div>
        <div v-if="selected.events?.length" class="event-list">
          <article v-for="event in selected.events" :key="event.id" class="event-card" :class="{ important: event.important }">
            <div class="event-card-head">
              <span class="category">{{ event.category }}</span>
              <time>{{ event.dateLabel }}</time>
            </div>
            <h3>{{ event.title }}</h3>
            <p>{{ event.summary }}</p>
            <a v-if="event.officialUrl" :href="event.officialUrl" target="_blank" rel="noreferrer">公式情報を見る →</a>
          </article>
        </div>
        <div v-else class="empty-state">現在表示できるイベント・お知らせはありません。</div>
      </section>

      <section class="content-section detail-section notice-section">
        <p class="eyebrow">NEXT</p><h2>旅先で役立つ情報をもっと</h2>
        <p>次は、公式イベントの自動取得、口コミ、混雑感、訪問記録をこの詳細ページに追加していきます。</p>
      </section>
    </main>

    <footer>よりみち道の駅 <span>公式情報への入口と、旅人の発見をひとつに。</span></footer>
  </div>
</template>
