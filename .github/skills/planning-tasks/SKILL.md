---
name: planning-tasks
description: 作業開始前に、実行可能なPlanを必ず作る（非自明な作業で使用し、選択肢比較・検証・リスク・ロールバック・チェックポイント・完了条件・cleanupを含める）。
---

# Plan-first（着手前に必ず計画を作る）

## 使うタイミング（When to use）
次のような「軽くない作業」を始める前に必ず使う：
- コード変更（feature / fix / refactor）
- AWS操作（S3 / CloudFront / IAM / Billing）
- Git操作（履歴編集、ブランチ戦略、rebase/reset など）
- リポジトリ全体に影響する変更（CI、設定方針、ドキュメント構造）

発火の合図（例）：
- 「何から始める？」
- 「ステップ作って」
- 「方針決めたい」
- 「これ進めたい」
- 「構成を決めたい」

## コアルール（必須）
実行に入らない。まずPlanだけを出す。
Do not execute. Output a plan first.

## Planの必須フォーマット（順序固定 / MUST）
以下の順序で必ず出力する。

### 1) 目的と成功条件（Goal & Success Criteria）
- 目的：1文
- 成功条件：3〜5個（測定できる形：観察可能、判定可能）

### 2) 制約と前提（Constraints & Assumptions）
- 制約：時間（timebox）、使えるツール、環境、コスト上限など
- 前提：必要最小限だけ（推測で増やさない）

### 3) 選択肢（Options：2〜3個に限定）
2〜3個だけ列挙（それ以上は出さない）。
各選択肢について：
- 特徴：学習 / 安全 / コスト / 運用 の観点で短く
- trade-off：1行で（何と何の交換か）

### 4) 結論（Recommendation：1つに決める）
- 今回の最適案：1行
- この文脈で最適な理由：2〜3個（短い箇条書き）

### 5) 実行手順（Step-by-step Plan：7〜12ステップ）
各ステップに必ず以下を含める：
- Action：やること（具体的）
- Verify：どう確認するか（コマンド/画面/期待結果）
- Risk：何が起きうるか（SECURITY / COST / AVAILABILITY / DATA LOSS / MISCONFIG）
- Rollback：戻し方（undo/revert/delete など安全に）

### 6) チェックポイント（Decision Gates）
- 2〜4個の判断ポイントを作る
- 各ポイントに Go/No-Go 条件（続行/中止の基準）を必ず書く

### 7) 完了条件とcleanup（Exit criteria & Cleanup）
- 完了条件：Doneの定義（何が揃ったら終了か）
- cleanup：一時リソースを消す手順 / AWSの課金停止のために消すもの / 安定状態に戻す手順

## 不確実な場合のルール（One-question rule）
重要情報が欠けていて安全にPlanが作れない場合：
- 最後に質問は1つだけ（狙い撃ち）
- それでも安全側のデフォルトPlanは出す（Assumptionsを明記）

## スタイル制約（短く、実行可能に）
- 文章は短く、箇条書きを中心にする
- “検証（Verify）” を最優先（理屈より観察）
- AWSは private-by-default と least privilege を優先
- コード変更は small & incremental（小さく刻む）
