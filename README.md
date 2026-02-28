# Campastella Web (Prototype)

Campastella（カムパステラ）の公式 Web サイトを Next.js 15（App Router）で長期運用することを前提に整備したプロトタイプです。  
`microCMS` をメイン CMS としつつ、外部 API（キャスト / 画像など）を Server Components / ISR 経由で安全に扱える構成を採用しています。

## ✅ 現状と TODO

- [x] Next.js 15（App Router）+ TypeScript Strict + Tailwind 4 による土台構築
- [x] microCMS / 外部 API のモックとフェッチレイヤー（`src/lib/microcms.ts`, `src/lib/external.ts`）
- [x] 主要ページ（`/`, `/about`, `/casts`, `/casts/[id]`, `/other`）の Server Components 実装（縦長/横長ディスプレイ両対応）
- [x] Webhook 連携用 API（`/api/revalidate`）と HMAC 検証
- [x] `.env.example` と `scripts/check-env.ts` による環境変数ガード
- [ ] microCMS モデル作成 + 本番データ投入
- [ ] 外部 API 仕様書の反映・Zod スキーマの同期（`docs/external-api/`）
- [ ] Sentry DSN 設定とエラーモニタリングの接続
- [ ] E2E / Visual Regression など長期運用向けテストの追加

## セットアップ

1. 依存インストール

   ```bash
   corepack enable
   pnpm install
   ```

2. `.env`（`cp .env.example .env.local`）を作成し、以下を設定

   ```bash
   MICROCMS_SERVICE_DOMAIN=xxxxx
   MICROCMS_API_KEY=xxxxx
   MICROCMS_WEBHOOK_SECRET=xxxxx
   EXTERNAL_API_BASE_URL=https://api.example.com
   EXTERNAL_API_KEY=xxxxx
   NEXT_PUBLIC_SITE_URL=https://campastella.jp
   ```

3. 必須の環境変数チェック

   ```bash
   pnpm check-env
   ```

4. ローカル開発

   ```bash
   pnpm dev
   ```

5. ビルド / 型チェック / Lint

   ```bash
   pnpm build
   pnpm typecheck
   pnpm lint
   ```

Python 系スクリプトを導入する場合は `uv`（`uv venv && source .venv/bin/activate`）を用いて `scripts/` 以下に配置してください。

## ディレクトリ構成（抜粋）

```
src/
  app/
    api/revalidate/route.ts   # microCMS Webhook 受け口
    layout.tsx                # サイト共通レイアウト (Header / Footer)
    page.tsx                  # トップページ
    about/page.tsx
    casts/[id]/page.tsx
    casts/page.tsx
    other/page.tsx
  components/
    cast-card.tsx
    cast-showcase.tsx
    container.tsx
    section.tsx
    seo.tsx
    site-footer.tsx
    site-header.tsx
  lib/
    cache-tags.ts
    constants.ts
    env.ts                    # 環境変数の型ガード (Zod)
    external.ts               # 外部 API フェッチ
    microcms.ts               # CMS フェッチ + フォールバック
    utils.ts
  types/env.d.ts
docs/
  overview.md                 # 仕様概要（旧 README）
  external-api/README.md      # 外部 API 仕様書の配置ルール
scripts/
  check-env.ts
```

## 開発フロー

1. **コンテンツ更新**  
   microCMS 更新 → `/api/revalidate` Webhook → 影響範囲のみ `revalidateTag`。
2. **外部 API 取得**  
   `src/lib/external.ts` で Server Components からのみ呼び出し。API キーはサーバー側で保持。
3. **型安全性の担保**  
   microCMS / 外部 API のレスポンスは Zod でバリデーション → ドメイン型を生成。
4. **運用監視**  
   後段で Sentry DSN を `.env` に追加し、`next.config.ts` の `sentry` セクションで有効化予定。

## 外部 API 仕様書の扱い

- 提供済みの仕様書は `docs/external-api/` 以下に配置してください（例: `docs/external-api/campanella-v3.md`）。
- 仕様変更は Pull Request で追跡できるようにし、`src/lib/external.ts` の Zod スキーマも合わせて更新します。
- `pnpm typecheck` でスキーマの食い違いを検知できます。

## Scripts

| コマンド             | 内容                                  |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | Next.js 開発サーバー起動             |
| `pnpm build`         | 本番ビルド                            |
| `pnpm start`         | 本番サーバー                          |
| `pnpm lint`          | ESLint（Core Web Vitals）            |
| `pnpm typecheck`     | TypeScript `--noEmit`                |
| `pnpm check-env`     | 必須環境変数の検証 (`scripts/check-env.ts`) |

## デプロイ

- GitHub に push → Vercel でインポートするだけで ISR が動作します。
- 必ず Vercel の Project Settings に `.env` と同じ環境変数を登録してください。
- microCMS Webhook は `POST https://<vercel-domain>/api/revalidate` を指定し、`MICROCMS_WEBHOOK_SECRET` を共有します。

## 参考ドキュメント

- `docs/overview.md` … 仕様概要・データソースの整理（旧 README）
- `docs/external-api/README.md` … 外部 API 仕様の配置ガイド

上記を起点に、実データ / デザイン適用や監視まわりの接続を進めれば本番運用に耐える構成になります。
