# Campastella Web

Next.js / microCMS / Vercel / uv-managed monorepo-ready project

このリポジトリは、カムパステラ（Campastella）の公式 HP を運用するための Next.js プロジェクトです。  
**uv を用いて環境管理**を行い、安定した長期運用を前提に設計されています。

---

# 🧭 全体像（仕様概要）

## 技術スタック

- **Next.js 15 (App Router)**
- **TypeScript (strict mode)**
- **Tailwind CSS**
- **microCMS**（CMS / キャスト・ページ管理）
- **外部 API**：画像やイベントデータなどを取得
- **Vercel**（デプロイ / ISR / 画像最適化）
- **Sentry**（エラーモニタリング）
- **uv**（Python 依存の管理・スクリプト管理基盤）

## データソース構成

- `microCMS`
  - `site_settings` … サイト全体の設定
  - `casts` … キャスト一覧
  - `pages` … 固定ページ
  - `links` … フッター等のリンク集
- `External API`
  - 画像・外部リソース
  - Next.js の Server Side で安全に取得しキャッシュ

## ページ構成

- `/`（トップページ）
- `/casts`（キャスト一覧）
- `/casts/[id]`（キャスト詳細）
- `/about`（参加方法／GoogleForm）
- `/other`（その他静的ページ）

---

# 🚀 最初にやること（TODO リスト）

1. **リポジトリクローン**

   ```
   git clone <repo>
   cd campastella-web
   ```

2. **uv のセットアップ**

   ```
   uv venv
   source .venv/bin/activate
   uv pip install -r requirements.txt
   ```

3. **環境変数設定**  
   `.env.local` を作成して以下を記入：

   ```
   MICROCMS_SERVICE_DOMAIN=xxxxx
   MICROCMS_API_KEY=xxxxx
   MICROCMS_WEBHOOK_SECRET=xxxxx
   EXTERNAL_API_KEY=xxxxx
   ```

4. **microCMS モデルの準備**

   - site_settings
   - casts
   - pages
   - links

5. **ローカル起動**

   ```
   pnpm install
   pnpm dev
   ```

6. **Vercel デプロイ**
   - GitHub に push
   - Vercel で import
   - 環境変数を登録
   - Deploy

---

# 📁 ディレクトリ構成

```
app/
  layout.tsx
  page.tsx
  apply/page.tsx
  casts/
    page.tsx
    [id]/page.tsx
  api/
    revalidate/route.ts   # microCMS webhook 受け口

components/
  Header.tsx
  Footer.tsx
  CastCard.tsx
  Section.tsx
  Seo.tsx

lib/
  microcms.ts
  external.ts
  cache-tags.ts
```

---

# ⚙️ 開発フロー

## 1. コンテンツ更新

microCMS で更新 → Webhook → `/api/revalidate` → 必要なページだけ再生成（ISR）

## 2. 外部 API 取得

- Next.js Server Actions or Route Handlers でデータ取得
- API キーは `.env` に保存しクライアントへ絶対に渡さない

## 3. デザイン

- Tailwind CSS を使用
- コンポーネントを `components/` に集約

---

# 🔐 セキュリティと運用

- API キーは必ず `.env` に置く
- microCMS Webhook は署名検証（HMAC）を行う
- 外部画像は `images.remotePatterns` で制限
- Sentry によるエラー監視

---

# 🛠️ uv の使い方（このプロジェクトでの用途）

このプロジェクトでは uv を以下のために使用します：

### 🔧 Python 製スクリプトの管理

- 画像キャッシュ生成
- バッチ処理
- データ同期
- 将来的な運用スクリプト

### 🔒 環境の固定

- `requirements.txt` と uv による再現性保証
- `.venv` に依存パッケージを隔離

---

# 📦 Build / Deploy

## Local Build

```
pnpm build
pnpm start
```

## Vercel

- プッシュで自動デプロイ
- Preview URL が自動生成

---

# 📝 今後の拡張予定

- イベント履歴ページ
- 画像最適化（ローカルキャッシュ or 外部 API 最適化）
- キャスト検索
- 多言語対応（必要になったら）

---

# 📄 ライセンス

This project is private and proprietary to ☾ampastella.
