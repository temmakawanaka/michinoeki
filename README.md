# michinoeki

道の駅の基本情報を横断検索できる MVP です。現在は `Next.js + PostgreSQL + Prisma` を使って、全国版ディレクトリの土台を作っています。

## 開発環境

1. Docker Desktop を起動する
2. 環境変数を `.env` に設定する
3. Postgres を立ち上げてスキーマを反映する
4. サンプルデータを取り込む

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

## 動作確認

```bash
npm test
npm run lint
npm run test:e2e
npm run build
```

ローカルでの確認ポイントは次のとおりです。

- トップページから駅名、都道府県、住所のキーワードで検索できる
- 検索結果から詳細ページへ遷移できる
- 詳細ページで営業時間、定休日、信頼度、ソース件数を確認できる