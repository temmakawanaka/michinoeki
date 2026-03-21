# michinoeki

道の駅の基本情報を横断検索できる MVP です。現在は `Next.js + PostgreSQL + Prisma` を使って、全国版ディレクトリの土台を作っています。

## 開発環境

1. Docker Desktop を起動する
2. 環境変数を `.env` に設定する
3. Postgres を立ち上げる

```bash
npm run db:up
npm run db:migrate -- --name init_station_master
npm run db:seed
```

## データ取り込み方針

- 国土交通省、都道府県、道の駅公式サイトを一次ソースとして優先します
- 民間の集約サイトは補助ソースとして扱います
- 各ソースのデータを正規化してから比較し、項目ごとに採用値を決めます
- 一次ソースがある値を優先しつつ、信頼度が十分な複数ソースの一致がある場合はそちらを採用できます
- 採用後も `StationSourceRecord` に生データと抽出値を残し、判断根拠を追えるようにします

## サンプル取り込み

```bash
npx tsx scripts/import-stations.ts data/sources/sample-source-a.json data/sources/sample-source-b.json data/sources/sample-source-c.json
```

このサンプルでは `mlit` と 2 つの集約ソースを比較し、`Station` と `StationSourceRecord` に保存します。