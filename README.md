# クラロワ ダメージ計算ツール

クラッシュロワイヤルのダメージ計算をシミュレーションできるWebアプリケーションです。

## 🎮 機能

- **防衛カード選択**: 防衛側として使用するカードを選択
- **攻撃カード管理**: 複数の攻撃カードを追加・編集・削除
- **ダメージ計算**: リアルタイムでダメージを計算し残りHPを表示
- **複数ダメージタイプ対応**: 範囲ダメージ、召喚ダメージ等を個別に設定可能
- **ダークモード対応**: システム設定に応じた表示切替
- **レスポンシブデザイン**: スマートフォンからデスクトップまで対応

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| UIライブラリ | Chakra UI v2 |
| 状態管理 | React Context API |
| アニメーション | Framer Motion |
| デプロイ | Vercel |

## 📁 プロジェクト構造

```
cr-tool/
├── cr-tool-react-next-app/   # メインアプリケーション (Next.js)
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # Reactコンポーネント
│   │   ├── context/          # Context API (状態管理)
│   │   ├── data/             # カードデータ (JSON)
│   │   ├── hooks/            # カスタムフック
│   │   ├── types/            # TypeScript型定義
│   │   ├── utils/            # ユーティリティ関数
│   │   └── constants.ts      # 定数定義
│   └── public/               # 静的ファイル (カード画像等)
├── cr-tool-react-app/        # 旧実装 (Vite版・アーカイブ)
├── docs/                     # ドキュメント
├── PROJECT_PLAN.md           # プロジェクト計画書
├── CODING_STANDARDS.md       # コーディング規約
└── README.md                 # このファイル
```

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18.x 以上
- npm 9.x 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/showdaiya/cr-tool.git
cd cr-tool

# Next.jsアプリのディレクトリに移動
cd cr-tool-react-next-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら http://localhost:3000 にアクセスしてください。

### 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番用ビルド
npm run build

# 本番モードで起動
npm run start

# ESLint実行
npm run lint
```

## 📖 使い方

1. **防衛カードを選択**: 画面上部の「選択」ボタンをクリックしてカードを選ぶ
2. **攻撃カードを追加**: 「攻撃カードを追加」ボタンでカードを追加
3. **攻撃回数を設定**: 各ダメージタイプごとに攻撃回数を入力
4. **結果を確認**: 防衛カードの残りHPがリアルタイムで表示される

## 🌐 デプロイ

このプロジェクトはVercelへのデプロイを想定しています。

### Vercel設定

- **Framework Preset**: Next.js
- **Root Directory**: `cr-tool-react-next-app`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 手動デプロイ

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
cd cr-tool-react-next-app
vercel --prod
```

## 📝 ドキュメント

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - プロジェクト計画書
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - コーディング規約
- [docs/FEATURES.md](./docs/FEATURES.md) - 機能一覧
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - アーキテクチャドキュメント
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - デプロイメントガイド

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)に従ってください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## ⚠️ 免責事項

このツールはファン作成の非公式ツールです。Supercellとは一切関係ありません。
クラッシュロワイヤルはSupercellの登録商標です。

---

**作成者**: [@showdaiya](https://github.com/showdaiya)
