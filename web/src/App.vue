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

type StationDetail = StationSummary & {
  latitude?: number | null;
  longitude?: number | null;
  parking?: { regularCars?: number | null; accessibleCars?: number | null; largeVehicles?: number | null } | null;
  specialties?: Specialty[];
};

const query = ref("");
const loading = ref(false);
const locationMessage = ref("");
const selected = ref<StationDetail | null>(null);

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
  },
];

const stations = ref<StationDetail[]>(demoStations);
const filteredStations = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return stations.value;
  return stations.value.filter((station) =>
    [station.name, station.prefecture, station.address, ...(station.specialties ?? []).map((item) => item.name)]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
});

async function searchStations() {
  loading.value = true;
  selected.value = null;
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
    selected.value = (await response.json()) as StationDetail;
  } catch {
    // デモ表示を継続する。
  }
}

function findNearby() {
  locationMessage.value = "";
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
        locationMessage.value = "位置情報は取得できました。近隣検索APIをマージ後、このまま距離順表示に切り替わります。";
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
      <button class="brand" @click="selected = null" aria-label="トップへ戻る">
        <span class="brand-mark">道</span>
        <span><strong>よりみち道の駅</strong><small>旅先の「ちょっと寄りたい」を見つける</small></span>
      </button>
      <button class="saved-button" aria-label="行きたいリスト">♡ <span>行きたい</span></button>
    </header>

    <main v-if="!selected">
      <section class="hero">
        <p class="eyebrow">MICHINOEKI GUIDE</p>
        <h1>次の休憩を、<br />旅の楽しみに。</h1>
        <p class="hero-copy">基本情報だけでなく、名物・特産品・イベントまで。道の駅を起点に、その土地らしさを探せるガイドです。</p>
        <form class="search-box" @submit.prevent="searchStations">
          <input v-model="query" placeholder="道の駅・地域・名物から探す" aria-label="検索キーワード" />
          <button type="submit">探す</button>
        </form>
        <button class="nearby-button" @click="findNearby">◎ 現在地から近い道の駅を探す</button>
        <p v-if="locationMessage" class="status-message">{{ locationMessage }}</p>
      </section>

      <section class="quick-links" aria-label="目的から探す">
        <button @click="query = '海鮮'">海鮮</button>
        <button @click="query = 'お茶'">お茶</button>
        <button @click="query = '野菜'">産直</button>
        <button @click="query = '足湯'">温泉・足湯</button>
      </section>

      <section class="content-section">
        <div class="section-heading">
          <div><p class="eyebrow">DISCOVER</p><h2>{{ query ? `「${query}」の候補` : 'まず寄ってみたい道の駅' }}</h2></div>
          <span>{{ filteredStations.length }}件</span>
        </div>

        <div v-if="loading" class="loading">情報を読み込んでいます…</div>
        <div v-else class="station-list">
          <article v-for="station in filteredStations" :key="station.slug" class="station-card" @click="openStation(station)">
            <div class="station-visual"><span>{{ station.prefecture.replace(/[都道府県]$/, '') }}</span></div>
            <div class="station-card-body">
              <p class="prefecture">{{ station.prefecture }}</p>
              <h3>{{ station.name }}</h3>
              <p class="address">{{ station.address }}</p>
              <div class="tags">
                <span v-if="station.openingHours">{{ station.openingHours }}</span>
                <span v-if="station.hasShop">直売所</span>
                <span v-if="station.hasWifi">Wi‑Fi</span>
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
          <button>♡ 行きたい</button>
        </div>
      </section>

      <section class="info-grid">
        <div><small>営業時間</small><strong>{{ selected.openingHours ?? '公式情報を確認' }}</strong></div>
        <div><small>休館日</small><strong>{{ selected.closingDays ?? '公式情報を確認' }}</strong></div>
        <div><small>普通車</small><strong>{{ selected.parking?.regularCars ?? '—' }}<span v-if="selected.parking?.regularCars">台</span></strong></div>
        <div><small>設備</small><strong>{{ [selected.hasShop && '直売所', selected.hasWifi && 'Wi‑Fi'].filter(Boolean).join('・') || '—' }}</strong></div>
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

      <section class="content-section detail-section notice-section">
        <p class="eyebrow">NEXT</p><h2>この先追加していく情報</h2>
        <p>イベント・臨時休業・混雑情報・口コミ・訪問記録を、この詳細ページに順次まとめていきます。</p>
      </section>
    </main>

    <footer>よりみち道の駅 <span>公式情報への入口と、旅人の発見をひとつに。</span></footer>
  </div>
</template>
