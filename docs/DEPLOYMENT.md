# デプロイメントガイド

このドキュメントは、クラロワダメージ計算ツールのデプロイ手順を説明します。

---

## 📋 目次

- [デプロイ方法の選択](#デプロイ方法の選択)
- [GitHub Pages へのデプロイ](#github-pages-へのデプロイ)
- [Vercel へのデプロイ](#vercel-へのデプロイ)
- [その他の静的ホスティング](#その他の静的ホスティング)
- [環境変数の設定](#環境変数の設定)
- [トラブルシューティング](#トラブルシューティング)

---

## 🎯 デプロイ方法の選択

このアプリケーションは **Next.js Static Export** で構築されており、静的ファイルとして配信可能です。
以下のいずれかの方法でデプロイできます。

| デプロイ先 | 難易度 | コスト | 自動デプロイ | 推奨度 |
|-----------|--------|--------|-------------|-------|
| **GitHub Pages** | ⭐⭐ | 無料 | ✅ GitHub Actions | ⭐⭐⭐⭐⭐ |
| **Vercel** | ⭐ | 無料 | ✅ Git連携 | ⭐⭐⭐⭐ |
| **Netlify** | ⭐ | 無料 | ✅ Git連携 | ⭐⭐⭐ |
| **Cloudflare Pages** | ⭐⭐ | 無料 | ✅ Git連携 | ⭐⭐⭐ |
| **AWS S3 + CloudFront** | ⭐⭐⭐ | 従量課金 | ⚠️ 手動設定 | ⭐⭐ |

**推奨**: **GitHub Pages** (無料・簡単・自動デプロイ設定済み)

---

## 🚀 GitHub Pages へのデプロイ

このリポジトリには GitHub Pages への自動デプロイが **すでに設定済み** です。

### 前提条件

- GitHub リポジトリが公開されている (Public)
- GitHub Pages が有効になっている

### デプロイ手順

#### 1. GitHub Pages を有効化

リポジトリの設定で GitHub Pages を有効にします。

1. リポジトリページで **Settings** → **Pages** に移動
2. **Source** を **GitHub Actions** に設定
3. 保存

#### 2. 自動デプロイ

`main` ブランチに push すると、自動的にビルド・デプロイされます。

```bash
# コミット・プッシュ
git add .
git commit -m "feat: Update feature"
git push origin main
```

#### 3. デプロイ状況の確認

1. リポジトリの **Actions** タブで進行状況を確認
2. デプロイ完了後、以下のURLでアクセス可能:
   ```
   https://<ユーザー名>.github.io/cr-tool/
   ```

### GitHub Actions ワークフロー

`.github/workflows/deploy-pages.yml` が自動デプロイを制御します。

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]      # main ブランチへの push でトリガー
  workflow_dispatch:      # 手動実行も可能

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: cr-tool-react-next-app/package-lock.json

      - name: Install
        working-directory: cr-tool-react-next-app
        run: npm ci

      - name: Build (static export)
        working-directory: cr-tool-react-next-app
        env:
          NEXT_PUBLIC_BASE_PATH: /cr-tool   # ベースパス設定
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: cr-tool-react-next-app/out   # 静的ファイル

      - name: Deploy
        uses: actions/deploy-pages@v4
```

### ベースパスの設定

GitHub Pages では `https://<ユーザー名>.github.io/<リポジトリ名>/` 配下に配信されるため、
**ベースパス** を設定する必要があります。

#### next.config.js

```javascript
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,              // /cr-tool
  assetPrefix: basePath, // /cr-tool
  images: {
    unoptimized: true,
  },
};
```

#### 環境変数

GitHub Actions では自動的に以下が設定されます:

```bash
NEXT_PUBLIC_BASE_PATH=/cr-tool
```

---

## ⚡ Vercel へのデプロイ

Vercel は Next.js の開発元が提供するホスティングサービスで、最も簡単にデプロイできます。

### 前提条件

- [Vercel アカウント](https://vercel.com/signup) (GitHub連携推奨)

### デプロイ手順

#### 方法1: ダッシュボードから (推奨)

1. [Vercel ダッシュボード](https://vercel.com/dashboard) にログイン
2. **New Project** をクリック
3. GitHub リポジトリ `cr-tool` を選択
4. **Framework Preset**: `Next.js` (自動検出)
5. **Root Directory**: `cr-tool-react-next-app` を設定
6. **Build Command**: `npm run build` (デフォルト)
7. **Output Directory**: `.next` → **`out`** に変更 (Static Export)
8. **Deploy** をクリック

#### 方法2: Vercel CLI

```bash
# Vercel CLI をインストール
npm install -g vercel

# プロジェクトディレクトリに移動
cd cr-tool-react-next-app

# デプロイ (初回はセットアップウィザードが起動)
vercel

# 本番デプロイ
vercel --prod
```

### 設定ファイル (vercel.json)

プロジェクトルートに `vercel.json` を作成して設定を保存できます。

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### 環境変数 (Vercel)

Vercel では `NEXT_PUBLIC_BASE_PATH` は **不要** です (ルート直下に配信されるため)。

---

## 🌐 その他の静的ホスティング

### Netlify

#### デプロイ手順

1. [Netlify](https://www.netlify.com/) にログイン
2. **New site from Git** をクリック
3. GitHub リポジトリ `cr-tool` を選択
4. 以下を設定:
   - **Base directory**: `cr-tool-react-next-app`
   - **Build command**: `npm run build`
   - **Publish directory**: `cr-tool-react-next-app/out`
5. **Deploy site** をクリック

#### netlify.toml (オプション)

```toml
[build]
  base = "cr-tool-react-next-app"
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Cloudflare Pages

#### デプロイ手順

1. [Cloudflare Pages](https://pages.cloudflare.com/) にログイン
2. **Create a project** → **Connect to Git**
3. GitHub リポジトリ `cr-tool` を選択
4. 以下を設定:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `cd cr-tool-react-next-app && npm run build`
   - **Build output directory**: `cr-tool-react-next-app/out`
5. **Save and Deploy** をクリック

---

### AWS S3 + CloudFront

#### 前提条件

- AWS アカウント
- AWS CLI インストール済み

#### デプロイ手順

```bash
# 1. ビルド
cd cr-tool-react-next-app
npm run build

# 2. S3 バケット作成
aws s3 mb s3://cr-tool-app

# 3. 静的ファイルをアップロード
aws s3 sync out/ s3://cr-tool-app --acl public-read

# 4. S3 バケットを静的ウェブサイトホスティングに設定
aws s3 website s3://cr-tool-app --index-document index.html --error-document 404.html

# 5. CloudFront ディストリビューション作成 (オプション・推奨)
# AWS Console で設定
```

---

## 🔧 環境変数の設定

### 開発環境

```bash
# .env.local (ローカル開発用)
NEXT_PUBLIC_BASE_PATH=
```

### 本番環境

| 環境 | `NEXT_PUBLIC_BASE_PATH` | 備考 |
|------|------------------------|------|
| GitHub Pages | `/cr-tool` | リポジトリ名 |
| Vercel | (不要) | ルート直下に配信 |
| Netlify | (不要) | ルート直下に配信 |
| Cloudflare Pages | (不要) | ルート直下に配信 |
| カスタムドメイン | (不要) | ルート直下に配信 |

---

## ⚙️ ビルド設定

### package.json スクリプト

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",               // 静的ビルド
    "start": "serve out -l 3000",        // ローカル配信 (out/ フォルダ)
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",          // Static Export モード
  trailingSlash: true,       // URL末尾に / を追加
  basePath,                  // ベースパス (GitHub Pages用)
  assetPrefix: basePath,     // アセットパス (GitHub Pages用)
  images: {
    unoptimized: true,       // 画像最適化無効化 (Static Export用)
  },
};

module.exports = nextConfig;
```

---

## 🧪 デプロイ前のテスト

### 1. ローカルビルドテスト

```bash
cd cr-tool-react-next-app

# ビルド
npm run build

# ローカル配信
npm run start

# ブラウザで確認
# http://localhost:3000
```

### 2. ベースパス付きテスト (GitHub Pages用)

```bash
# ベースパス付きでビルド
NEXT_PUBLIC_BASE_PATH=/cr-tool npm run build

# ローカル配信 (ベースパス考慮)
npm run start

# ブラウザで確認
# http://localhost:3000/cr-tool/
```

### 3. Lint・テスト

```bash
# ESLint
npm run lint

# 型チェック
npx tsc --noEmit

# テスト
npm run test
```

---

## 🚨 トラブルシューティング

### 問題1: GitHub Pages で 404 エラー

**原因**: ベースパスが正しく設定されていない

**解決策**:
1. `NEXT_PUBLIC_BASE_PATH=/cr-tool` が設定されているか確認
2. `next.config.js` の `basePath` と `assetPrefix` が正しいか確認
3. 画像パスが `${BASE_PATH}/cards/...` になっているか確認

### 問題2: GitHub Pages でリロード時に 404

**原因**: Next.js Static Export では SPA として動作するため

**解決策**:
- GitHub Pages は自動的に `404.html` を `index.html` にリダイレクトする
- Next.js が自動的に `out/404.html` を生成するため、通常は対応不要

### 問題3: Vercel でビルドエラー

**原因**: `Root Directory` が正しく設定されていない

**解決策**:
1. Vercel プロジェクト設定で **Root Directory** を `cr-tool-react-next-app` に設定
2. **Output Directory** を `out` に設定

### 問題4: 画像が表示されない

**原因1**: ベースパスが正しくない

**解決策**:
```typescript
// ❌ Bad
<img src="/cards/archers.png" />

// ✅ Good
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
<img src={`${BASE_PATH}/cards/archers.png`} />
```

**原因2**: 画像ファイルが `public/` に存在しない

**解決策**:
```bash
# 画像ファイルの存在確認
ls -la cr-tool-react-next-app/public/cards/
```

### 問題5: CSS が反映されない

**原因**: Tailwind CSS のビルドエラー

**解決策**:
```bash
# キャッシュクリア
rm -rf .next
rm -rf out

# 再ビルド
npm run build
```

### 問題6: GitHub Actions が失敗する

**原因**: GitHub Pages が有効になっていない

**解決策**:
1. リポジトリ **Settings** → **Pages**
2. **Source** を **GitHub Actions** に設定
3. ワークフローを再実行

---

## 📊 デプロイ後のチェックリスト

- [ ] ビルドが成功した
- [ ] デプロイが完了した
- [ ] サイトにアクセスできる
- [ ] 全ページが正常に表示される
- [ ] 画像が正しく表示される
- [ ] ダークモードが動作する
- [ ] モバイル表示が正常
- [ ] カード選択が動作する
- [ ] ダメージ計算が正常
- [ ] リセット機能が動作する

---

## 🔮 今後の改善案

### カスタムドメイン設定

#### GitHub Pages

1. ドメインを取得
2. DNS設定で CNAME レコードを追加:
   ```
   www.example.com → <ユーザー名>.github.io
   ```
3. リポジトリ **Settings** → **Pages** → **Custom domain** に設定

#### Vercel

1. Vercel ダッシュボードでプロジェクトを選択
2. **Settings** → **Domains**
3. ドメインを追加し、DNS設定に従って CNAME レコードを追加

### HTTPS 強制

- GitHub Pages: 自動で HTTPS が有効
- Vercel: 自動で HTTPS が有効
- カスタムドメイン: Let's Encrypt 証明書が自動発行

### パフォーマンス最適化

- Lighthouse スコア測定
- 画像の WebP 変換 (手動)
- バンドルサイズ削減 (動的インポート)

---

## 📚 参考資料

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages 公式ドキュメント](https://docs.github.com/en/pages)
- [Vercel 公式ドキュメント](https://vercel.com/docs)
- [Netlify 公式ドキュメント](https://docs.netlify.com/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

**最終更新**: 2025-12-22  
**バージョン**: 1.0.0
