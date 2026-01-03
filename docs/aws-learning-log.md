# AWS Learning Log

AWS サービスの学習記録（カテゴリ別）。

---

# 目次

- [AWS - 基礎概念](#aws---基礎概念)
- [S3](#s3)
- [CloudFront](#cloudfront)
- [IAM](#iam)
- [AWS CLI](#aws-cli)

---

# AWS - 基礎概念

## リージョンとアベイラビリティゾーン

**説明**: AWSのインフラ構成の基本単位

```
リージョン (ap-northeast-1 = 東京)
├── AZ-a (データセンター群)
├── AZ-c
└── AZ-d
```

| 用語 | 説明 |
|------|------|
| リージョン | 地理的に離れた独立したエリア（東京、大阪、バージニア等） |
| AZ (Availability Zone) | リージョン内の独立したデータセンター群 |

**リージョン選びのポイント**:
- ユーザーに近い → レイテンシー低減
- 料金が異なる → 東京は比較的高め
- サービスの提供状況 → 新サービスは米国リージョンが先

**学んだ日**: 2026-01-03

---

## 課金モデル

**説明**: AWSは従量課金が基本

| モデル | 説明 | 例 |
|--------|------|-----|
| 従量課金 | 使った分だけ | S3ストレージ、データ転送 |
| 時間課金 | 起動時間 | EC2インスタンス |
| リクエスト課金 | APIコール数 | Lambda、API Gateway |

**無料枠**:
- 12ヶ月無料枠: EC2 t2.micro など
- 永続無料枠: Lambda 100万リクエスト/月 など

**コスト管理のベストプラクティス**:
- 請求アラートを設定
- 不要なリソースは削除
- タグでコスト追跡

**学んだ日**: 2026-01-03

---

# S3

## 概要

**説明**: Simple Storage Service。オブジェクトストレージサービス。

**用途**:
- 静的ウェブサイトホスティング
- バックアップ・アーカイブ
- データレイク
- アプリケーションデータ保存

**基本概念**:
| 用語 | 説明 |
|------|------|
| バケット | オブジェクトを入れる容器（グローバルで一意の名前が必要） |
| オブジェクト | ファイル + メタデータ |
| キー | オブジェクトの識別子（ファイルパスのようなもの） |

**学んだ日**: 2026-01-03

---

## バケットポリシー

**説明**: バケット単位のアクセス制御

**例: CloudFront OACからのアクセスのみ許可**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-name/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::account-id:distribution/distribution-id"
        }
      }
    }
  ]
}
```

**セキュリティのベストプラクティス**:
- パブリックアクセスはデフォルトでブロック
- 最小権限の原則
- CloudFront経由でのみ公開（OAC使用）

**学んだ日**: 2026-01-03

---

# CloudFront

## 概要

**説明**: CDN（Content Delivery Network）サービス

**メリット**:
- 世界中のエッジロケーションからコンテンツ配信
- レイテンシー低減
- DDoS対策
- HTTPS対応

**基本概念**:
| 用語 | 説明 |
|------|------|
| ディストリビューション | CloudFrontの設定単位 |
| オリジン | コンテンツの取得元（S3、EC2、外部サーバー等） |
| エッジロケーション | ユーザーに近いキャッシュサーバー |

**学んだ日**: 2026-01-03

---

## OAC (Origin Access Control)

**説明**: S3へのアクセスをCloudFront経由のみに制限する仕組み

**OAI vs OAC**:
| 項目 | OAI (旧) | OAC (新・推奨) |
|------|----------|----------------|
| SSE-KMS | ❌ 非対応 | ✅ 対応 |
| 署名バージョン | v2 | v4 (SigV4) |
| 推奨度 | 非推奨 | ✅ 推奨 |

**設定手順**:
1. CloudFrontでOACを作成
2. ディストリビューションにOACを関連付け
3. S3バケットポリシーを更新

**学んだ日**: 2026-01-03

---

# IAM

## 概要

**説明**: Identity and Access Management。認証・認可を管理。

**基本概念**:
| 用語 | 説明 |
|------|------|
| ユーザー | 人間がログインするためのID |
| グループ | ユーザーをまとめたもの |
| ロール | AWSサービスやアプリに付与する権限 |
| ポリシー | 権限の定義（JSON形式） |

**ベストプラクティス**:
- ルートユーザーは使わない
- MFAを有効化
- 最小権限の原則
- アクセスキーは定期的にローテーション

**学んだ日**: 2026-01-03

---

## ポリシーの構造

**説明**: JSON形式で権限を定義

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",           // Allow or Deny
      "Action": "s3:GetObject",    // 許可するアクション
      "Resource": "arn:aws:s3:::bucket/*"  // 対象リソース
    }
  ]
}
```

**学んだ日**: 2026-01-03

---

# AWS CLI

## 基本設定

**説明**: コマンドラインからAWSを操作

**インストール確認**:
```powershell
aws --version
```

**初期設定**:
```powershell
aws configure
# AWS Access Key ID: xxxxxxxxxx
# AWS Secret Access Key: xxxxxxxxxx
# Default region name: ap-northeast-1
# Default output format: json
```

**プロファイル切替**:
```powershell
aws configure --profile dev
aws s3 ls --profile dev
```

**学んだ日**: 2026-01-03

---

## S3操作

**使用例**:
```powershell
# バケット一覧
aws s3 ls

# ファイルアップロード
aws s3 cp file.txt s3://bucket-name/

# 同期（デプロイによく使う）
aws s3 sync ./dist s3://bucket-name/ --delete

# ファイル削除
aws s3 rm s3://bucket-name/file.txt
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `--delete` | 同期時に余分なファイルを削除 |
| `--dryrun` | 実行せず結果だけ表示 |
| `--recursive` | 再帰的に処理 |

**学んだ日**: 2026-01-03

---
