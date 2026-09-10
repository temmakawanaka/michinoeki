# michinoeki

道の駅データを扱うバックエンド API です。まずは GET のみで動く小さな Node.js サーバーとして整理しています。

## 構成

- `src/server.ts`: HTTP サーバーの起動
- `src/http/app.ts`: API ルーティング
- `src/lib/stations`: 道の駅検索・詳細取得・近隣検索のロジック
- `src/lib/importers`: 複数ソースの取り込み・正規化ロジック
- `prisma/schema.prisma`: PostgreSQL 用の Prisma スキーマ
- `data/sources`: 取り込み動作用のサンプルデータ

## セットアップ

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:migrate
npm run db:seed
```

## 起動

```bash
npm run dev
```

既定では `http://localhost:3000` で起動します。ポートを変える場合は `PORT` を指定します。

```bash
PORT=4000 npm run dev
```

## GET API

- `GET /api/health`
- `GET /api/stations?q=富士&prefecture=静岡県`
- `GET /api/stations/nearby?lat=34.7108&lng=137.7261&radiusKm=50&limit=20`
- `GET /api/stations/:stationSlug`
- `GET /api/prefectures`
- `GET /api/search?q=富士` は旧 API 互換用です。

### 近隣検索

`/api/stations/nearby` はブラウザの Geolocation API などで取得した緯度・経度を受け取り、直線距離が近い順に道の駅を返します。

- `lat`: 緯度（必須）
- `lng`: 経度（必須）
- `radiusKm`: 検索半径。既定 50km、最大 300km
- `limit`: 最大件数。既定 20件、最大 50件

返却値には各駅の `latitude`、`longitude`、`distanceKm` を含むため、フロント側の地図表示にもそのまま利用できます。

## データ取り込み

```bash
npm run import:stations -- data/sources/sample-source-a.json data/sources/sample-source-b.json data/sources/sample-source-c.json
```

## 今後のプロダクト方針

このプロジェクトは、単なる道の駅一覧ではなく「道の駅情報のハブ」を目指します。

1. 道の駅の基本情報・営業時間・設備・公式サイトへの導線
2. 現在地から近い道の駅の検索と地図表示
3. 特産品・名物・グルメ情報
4. イベント・季節情報・臨時休業などの更新情報
5. ユーザーのお気に入り・訪問記録・スタンプ帳
6. 口コミ、写真、混雑感、売り切れなどのユーザー投稿
7. ドライブ計画向けのルート上検索・複数駅巡回

公式情報とユーザー投稿を混同しないよう、情報ごとに出典・確認日時・信頼度を持たせる設計を基本方針とします。

## 確認

```bash
npm test
npm run typecheck
```
