# michinoeki

道の駅データを扱うバックエンド API です。まずは GET のみで動く小さな Node.js サーバーとして整理しています。

## 構成

- `src/server.ts`: HTTP サーバーの起動
- `src/http/app.ts`: API ルーティング
- `src/lib/stations`: 道の駅検索・詳細取得のロジック
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
- `GET /api/stations/:stationSlug`
- `GET /api/specialties?q=しらす&category=グルメ`
- `GET /api/specialties?stationSlug=michinoeki-fuji`
- `GET /api/prefectures`
- `GET /api/search?q=富士` は旧 API 互換用です。

### 特産品・名物・グルメ

道の駅詳細の `specialties` には、次のような情報を返します。

- 名称 / 説明
- カテゴリ（例: `特産品`, `グルメ`）
- 画像 URL
- 価格表示
- 販売場所
- 季節性
- 公式 URL
- 情報源 URL / 確認日時 / 信頼度

`GET /api/specialties` を使うと、駅をまたいで名称・説明・カテゴリ・販売場所を横断検索できます。

価格、販売時期、売り切れなどは変動しやすいため、フロントエンドでは `sourceUrl`、`observedAt`、`trustScore` とあわせて表示する想定です。

## データ取り込み

```bash
npm run import:stations -- data/sources/sample-source-a.json data/sources/sample-source-b.json data/sources/sample-source-c.json
```

## 確認

```bash
npm test
npm run typecheck
```
