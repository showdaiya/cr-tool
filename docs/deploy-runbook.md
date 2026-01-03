# Deploy Runbook

デプロイ手順・検証・クリーンアップを記録するランブック。

---

## 環境情報

| 項目 | 値 |
|------|-----|
| デプロイ先 | Vercel（予定） |
| アプリディレクトリ | `cr-tool-react-next-app/` |
| フレームワーク | Next.js 15 |
| Node.js | (要確認) |

---

## デプロイ手順

### 1. 事前チェック

```powershell
cd cr-tool-react-next-app
npm run lint
npm run build
```

**期待結果**: エラーなしでビルド完了

### 2. Vercelデプロイ（初回）

```powershell
# Vercel CLIインストール（初回のみ）
npm install -g vercel

# ログイン
vercel login

# デプロイ（プレビュー）
vercel

# 本番デプロイ
vercel --prod
```

### 3. デプロイ後の検証

- [ ] デプロイURLにアクセスできる
- [ ] トップページが表示される
- [ ] カード選択機能が動作する
- [ ] ダメージ計算が正しく動作する
- [ ] モバイル表示が正常

---

## Cleanup（課金停止・リソース削除）

### Vercelプロジェクト削除

1. Vercel Dashboard → Settings → General
2. "Delete Project" を選択
3. プロジェクト名を入力して確認

**注意**: 削除すると復元不可

---

## トラブルシューティング

### ビルドエラー時

```powershell
# キャッシュクリア
Remove-Item -Recurse -Force .next
npm run build
```

### デプロイ失敗時

1. Vercel Dashboard でビルドログを確認
2. ローカルで `npm run build` が通るか確認
3. 環境変数の設定漏れをチェック

---

## 履歴

| 日付 | 内容 | 担当 |
|------|------|------|
| 2026-01-03 | Runbook雛形作成 | - |

---
