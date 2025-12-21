# 2025-12-21 作業まとめ（UI刷新 / Static Export / GitHub Pages）

このリポジトリ（`cr-tool`）で実施した作業内容を、学習用に時系列でまとめます。

## 1. UIを Chakra UI → shadcn/ui + Tailwind へ移行
- Chakra UI 依存を削除し、画面の見た目・UI部品を shadcn/ui（Radix UI）+ Tailwind に統一。
- 主要画面を置換：
  - `CardBattlePage`
  - `AttackCard`, `AttackCardSection`
  - `DefenceCard`
  - `SelectCardOverlay`
  - `DefenseNotification`
  - `ErrorBoundary`
- Chakra Provider を削除。

### 目的
- 今後のUI拡張（テーマ・コンポーネント追加・デザイン調整）をしやすくするため。

## 2. テスト追加（UIレンダリング/表示系）
- `cr-tool-react-next-app/tests/ui.components.test.tsx` を追加
  - React Testing Library + Vitest で主要UIの描画確認
  - light/dark それぞれの表示確認（DOMに `document.documentElement.classList.add('dark')` を付与してチェック）
- `cr-tool-react-next-app/vitest.config.ts` を追加
  - `@` エイリアス（`@ -> src`）
  - JSX transform（automatic）
  - jsdom/globals の有効化

## 3. Static Export（サーバーレス配信向け）対応
- `cr-tool-react-next-app/next.config.js` を追加/更新
  - `output: 'export'`（static export）
  - `trailingSlash: true`
  - `images.unoptimized: true`（static exportでは画像最適化が使えないため）

### ローカル確認方法
- ビルド（= export）
  - `npm run build`
  - `out/` フォルダが生成される
- 静的配信のローカル起動
  - `npm run start`

> 注意：`output: 'export'` の場合、`next start` は使えません（Next公式の仕様）。

## 4. GitHub Pages（Project Pages）向け対応
### 4-1. basePath / assetPrefix 対応
GitHub Pagesは通常 `https://<user>.github.io/<repo>/` 配下に配信されるため、
アセットパスやURLの先頭に `/cr-tool` が付く必要があります。

- `next.config.js`
  - `basePath` / `assetPrefix` を `NEXT_PUBLIC_BASE_PATH` から設定
- カード画像の参照パス
  - `AttackCard.tsx`, `DefenceCard.tsx` の画像パスを `BASE_PATH` 付きに修正

### 4-2. GitHub Actionsで自動デプロイ
- `.github/workflows/deploy-pages.yml` を追加
  - `main` push で
    1) `npm ci`
    2) `NEXT_PUBLIC_BASE_PATH=/cr-tool npm run build`
    3) `out/` を artifact として upload
    4) GitHub Pagesへ deploy

### 4-3. Pages未有効時の404エラー対応
Actionsログで以下が出たため：
- `HttpError: Not Found - Get Pages site failed...`

対策：
- `actions/configure-pages@v5` に `enablement: true` を追加（Actions側でPagesを有効化できる場合に自動で有効化）

## 5. 「AIっぽいデザイン」修正（見た目の落ち着き）
- `CardBattlePage` のヘッダーから強いグラデーションを削除し、シンプルなカード調に変更。
- `DefenseNotification` のHTML構造を修正（button入れ子問題の解消）
- `Badge` を `div` → `span` に変更（不正なDOM構造の回避）
- `SelectCardOverlay` に `DialogDescription` を追加（アクセシビリティ警告の抑制）

## 次にやると良いこと（TODO）
- GitHub Pages Settings で「Source: GitHub Actions」になっているか確認
- もし `NEXT_PUBLIC_BASE_PATH` を変える場合（例: user pages直下）、workflowとnext.configを合わせて変更
- UIの「警告を完全0」にする（HTML構造やRadixの説明文など）

---

## 主要コマンド
- 開発
  - `cd cr-tool-react-next-app`
  - `npm install`
  - `npm run dev`
- テスト
  - `npm run test`
- 静的ビルド（export）
  - `npm run build`
- 静的配信（out/を配信）
  - `npm run start`
