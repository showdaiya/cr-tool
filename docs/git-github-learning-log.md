# Git / GitHub Learning Log

Git、GitHub、GitHub Copilot の学習記録（カテゴリ別）。

---

# 目次

- [Git - 基礎概念](#git---基礎概念)
- [Git - ブランチ操作](#git---ブランチ操作)
- [Git - ステージング・コミット](#git---ステージングコミット)
- [Git - リモート操作](#git---リモート操作)
- [Git - 状態確認](#git---状態確認)
- [GitHub - 基礎](#github---基礎)
- [GitHub - Pull Request](#github---pull-request)
- [GitHub - Actions](#github---actions)
- [GitHub Copilot](#github-copilot)

---

# Git - 基礎概念

## ブランチとは

**説明**: Gitの「ブランチ」は作業の分岐点を作る仕組み。本流（main）を壊さずに別の作業ができる。

**イメージ**:
```
main:     A --- B --- C --- D（本番）
               \
feature:        E --- F（新機能開発中）
```

**なぜ使う？**:
- 本番コードを壊さずに実験できる
- 複数人で同時に別機能を開発できる
- 失敗しても捨てやすい

**ブランチ命名規則**:
| プレフィックス | 用途 | 例 |
|---------------|------|-----|
| `feat/` | 新機能 | `feat/dark-mode` |
| `fix/` | バグ修正 | `fix/login-error` |
| `docs/` | ドキュメントのみ | `docs/add-readme` |
| `chore/` | 保守作業 | `chore/update-deps` |
| `spike/` | 実験（捨てる前提） | `spike/try-new-lib` |

**補足**: ブランチ名の `/` はフォルダではなく**命名規則**。可読性のため。

**学んだ日**: 2026-01-03

---

## ワーキングディレクトリ / ステージング / コミット

**説明**: Gitには3つの「状態」がある

```
[ワーキングディレクトリ] --git add--> [ステージング] --git commit--> [コミット履歴]
      (作業中)                         (次に保存する)                  (保存済み)
```

| 状態 | 説明 | 確認方法 |
|------|------|----------|
| ワーキングディレクトリ | 実際のファイル（編集中） | `git status`（赤字） |
| ステージング（インデックス） | 次のコミットに含める予定 | `git status`（緑字） |
| コミット履歴 | 保存済みのスナップショット | `git log` |

**なぜ2段階？**:
- 変更の一部だけをコミットできる
- コミット前に確認・調整できる

**学んだ日**: 2026-01-03

---

## リモートとローカル

**説明**: Gitは「分散型」。手元（ローカル）とサーバー（リモート）に別々のリポジトリがある。

```
[ローカル]                    [リモート（GitHub）]
    │                               │
    │ ←── git pull ────────────────┘
    │                               
    └─── git push ─────────────────→
```

| 用語 | 意味 |
|------|------|
| ローカル | 自分のPC上のリポジトリ |
| リモート | GitHub等のサーバー上のリポジトリ |
| origin | リモートのデフォルト名（慣習） |
| upstream | ローカルブランチが追跡するリモートブランチ |

**学んだ日**: 2026-01-03

---

# Git - ブランチ操作

## `git checkout -b <branch>`

**説明**: 新規ブランチを作成して、同時にそのブランチに切り替える

**基礎知識**:
```powershell
# これは2コマンドを1つにまとめたもの
git branch <branch>      # ブランチ作成
git checkout <branch>    # ブランチ切替
```

**使用例**:
```powershell
git checkout -b docs/add-decision-log-and-runbook
git checkout -b feat/new-feature
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `-b` | ブランチ作成と切替を同時に行う |
| `-B` | 既存ブランチがあれば上書き（危険） |

**関連コマンドとの違い**:
| コマンド | 用途 |
|----------|------|
| `git checkout -b` | 新規作成 + 切替 |
| `git checkout` | 既存に切替のみ |
| `git branch` | 作成のみ（切替しない） |
| `git switch -c` | 新しい書き方（Git 2.23+） |

**`git switch` vs `git checkout`**:
```powershell
# 古い書き方（今でも使える）
git checkout -b feat/new

# 新しい書き方（推奨）
git switch -c feat/new
```
- `checkout` は多機能すぎた（ブランチ切替 + ファイル復元 + ...）
- `switch` はブランチ操作専用で分かりやすい

**応用パターン**:
```powershell
# 特定のコミットからブランチを作成
git checkout -b hotfix/urgent abc1234

# リモートブランチを元にローカルブランチ作成
git checkout -b feat/copy origin/feat/original
```

**よくあるエラーと対処**:
| エラー | 原因 | 対処 |
|--------|------|------|
| `already exists` | 同名ブランチがある | 別名にするか `git branch -d` で削除 |
| `uncommitted changes` | 未コミットの変更がある | `git stash` で退避 or コミット |

**学んだ日**: 2026-01-03

**関連リンク**: [Git公式 - git-checkout](https://git-scm.com/docs/git-checkout)

---

## `git checkout <branch>`

**説明**: 既存ブランチに切り替える

**使用例**:
```powershell
git checkout main
git checkout develop
git checkout feat/dark-mode
```

**切り替え時に何が起きる？**:
| ファイル状態 | 動作 |
|-------------|------|
| 変更なし | 瞬時に切替（ポインタ移動のみ） |
| 新規ファイル追加 | そのまま残る |
| 既存ファイル編集中 | エラー or 警告 |

**関連コマンド**:
```powershell
# 新しい書き方
git switch main

# 直前のブランチに戻る
git checkout -
git switch -
```

**応用パターン**:
```powershell
# ファイルを特定コミットの状態に戻す（ブランチ切替ではない）
git checkout abc1234 -- path/to/file.txt

# HEADの状態に戻す（変更を捨てる）
git checkout -- path/to/file.txt
```

**注意**: `git checkout` はブランチ切替とファイル復元の両方に使えるため混乱しやすい。ブランチ操作は `git switch`、ファイル復元は `git restore` を使うのが現代的。

**学んだ日**: 2026-01-03

---

## `git branch`

**説明**: ブランチの一覧表示・作成・削除

**使用例**:
```powershell
# 一覧表示
git branch              # ローカルのみ
git branch -a           # リモート含む全て
git branch -r           # リモートのみ

# 作成（切替しない）
git branch feat/new-feature

# 削除
git branch -d feat/merged      # マージ済みのみ削除可
git branch -D feat/unmerged    # 強制削除（未マージでも）

# 名前変更
git branch -m old-name new-name
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `-a` | 全ブランチ表示（リモート含む） |
| `-r` | リモートブランチのみ表示 |
| `-d` | 削除（安全：マージ済みのみ） |
| `-D` | 強制削除（危険） |
| `-m` | 名前変更 |

**学んだ日**: 2026-01-03

---

# Git - ステージング・コミット

## `git add <file>`

**説明**: ファイルをステージング（次のコミットに含める準備）

**使用例**:
```powershell
# 特定ファイル
git add docs/decision-log.md docs/deploy-runbook.md

# 全ファイル
git add .
git add -A

# パターン指定
git add *.md
git add src/
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `.` | カレントディレクトリ以下すべて |
| `-A` / `--all` | 全変更（削除含む） |
| `-p` / `--patch` | 対話的に部分追加 |

**応用: 部分的なステージング**:
```powershell
# ファイル内の一部だけステージング
git add -p file.txt
# y: この変更を追加
# n: スキップ
# s: さらに分割
```

**間違えたときの取り消し**:
```powershell
# ステージングを取り消す（ファイルは残る）
git restore --staged file.txt

# 古い書き方
git reset HEAD file.txt
```

**学んだ日**: 2026-01-03

---

## `git commit -m "<message>"`

**説明**: ステージングした変更をコミット（保存）

**使用例**:
```powershell
git commit -m "docs: decision-log.md と deploy-runbook.md の雛形を追加"
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `-m` | メッセージを指定 |
| `-a` | 変更ファイルを自動add（新規ファイルは除く） |
| `--amend` | 直前のコミットを修正 |

**コミットメッセージ規約**:
```
<type>: <subject>

<body>（任意）

<footer>（任意）
```

| type | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメント |
| `refactor` | リファクタリング |
| `style` | フォーマット修正 |
| `test` | テスト |
| `chore` | その他（ビルド、ツール等） |

**悪い例 vs 良い例**:
```powershell
# ❌ 悪い
git commit -m "update"
git commit -m "fix"

# ✅ 良い
git commit -m "fix: ログイン時のnullエラーを修正"
git commit -m "feat: ダークモード切替ボタンを追加"
```

**直前のコミットを修正**:
```powershell
# メッセージだけ修正
git commit --amend -m "新しいメッセージ"

# ファイルを追加してコミットし直す
git add forgotten-file.txt
git commit --amend --no-edit
```

**注意**: `--amend` はpush済みのコミットには使わない（履歴が変わる）

**学んだ日**: 2026-01-03

---

# Git - リモート操作

## `git push -u origin <branch>`

**説明**: ブランチをリモートにpushし、upstream（上流）を設定する

**基礎知識 - upstreamとは**:
```
[ローカル]                      [リモート]
docs/add-...  ←── 紐付け ───→  docs/add-...
              （upstream設定）
```
- ローカルブランチが「どのリモートブランチと対応するか」の設定
- 設定すると `git push` / `git pull` だけで済む

**使用例**:
```powershell
# 初回push（upstream設定付き）
git push -u origin docs/add-decision-log-and-runbook

# 2回目以降（省略できる）
git push
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `-u` / `--set-upstream` | upstream設定 |
| `--force` / `-f` | 強制push（危険） |
| `--force-with-lease` | 安全な強制push |

**リモートにブランチがない場合**: 自動で作成される ✅

**関連コマンド**:
```powershell
# upstream確認
git branch -vv

# リモートブランチ削除
git push origin --delete branch-name
```

**よくあるエラーと対処**:
| エラー | 原因 | 対処 |
|--------|------|------|
| `rejected - non-fast-forward` | リモートが先に進んでいる | `git pull` してから再push |
| `no upstream branch` | upstream未設定 | `-u` オプションを付ける |

**強制pushの使いどころ**:
```powershell
# 自分専用ブランチで履歴を整理した後
git push --force-with-lease

# ❌ 絶対やってはいけない
git push -f origin main  # 他人の作業を消す可能性
```

**学んだ日**: 2026-01-03

**関連リンク**: [Git公式 - git-push](https://git-scm.com/docs/git-push)

---

## `git pull`

**説明**: リモートの変更をローカルに取り込む（fetch + merge）

**使用例**:
```powershell
# upstream設定済みなら
git pull

# 明示的に指定
git pull origin main
```

**内部動作**:
```powershell
# git pull は以下と同じ
git fetch origin
git merge origin/main
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `--rebase` | merge ではなく rebase で取り込む |
| `--ff-only` | fast-forward できる場合のみ実行 |

**merge vs rebase**:
```
# merge（デフォルト）: マージコミットができる
A --- B --- C --- M
       \         /
        D --- E

# rebase: 直線的な履歴になる
A --- B --- C --- D' --- E'
```

**学んだ日**: 2026-01-03

---

## `git fetch`

**説明**: リモートの情報を取得（ローカルには反映しない）

**使用例**:
```powershell
git fetch origin
git fetch --all    # 全リモート
```

**`git pull` との違い**:
| コマンド | 動作 |
|----------|------|
| `git fetch` | リモート情報を取得するだけ |
| `git pull` | fetch + merge（ローカルに反映） |

**使いどころ**: 「リモートに何があるか確認したいけど、まだマージしたくない」とき

**学んだ日**: 2026-01-03

---

# Git - 状態確認

## `git status`

**説明**: 現在の変更状態を確認

**使用例**:
```powershell
git status
git --no-pager status    # ページャーなし
git status -s            # 短縮表示
```

**出力の読み方**:
```
Changes not staged for commit:    ← 変更あり（未ステージング）
  modified:   file.txt            ← 赤字

Changes to be committed:          ← ステージング済み
  new file:   new.txt             ← 緑字

Untracked files:                  ← 未追跡（新規ファイル）
  other.txt
```

**短縮表示（`-s`）の読み方**:
```
M  file.txt      # ステージング済みの変更
 M file.txt      # 未ステージングの変更
MM file.txt      # 両方
A  new.txt       # 新規追加（ステージング済み）
?? untracked.txt # 未追跡
```

**学んだ日**: 2026-01-03

---

## `git log`

**説明**: コミット履歴を表示

**使用例**:
```powershell
git --no-pager log --oneline -1     # 最新1件を1行で
git --no-pager log --oneline -10    # 最新10件
git log --graph --oneline           # グラフ表示
git log --author="name"             # 特定の人のコミット
git log -- path/to/file             # 特定ファイルの履歴
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `--oneline` | 1コミット1行 |
| `-n` / `-<数字>` | 表示件数 |
| `--graph` | ブランチをグラフ表示 |
| `--author` | 著者でフィルタ |
| `--since` / `--until` | 日付でフィルタ |

**便利なエイリアス**:
```powershell
# ~/.gitconfig に追加すると便利
git config --global alias.lg "log --oneline --graph --all"
# 使い方: git lg
```

**学んだ日**: 2026-01-03

---

## `git diff`

**説明**: 変更内容の差分を表示

**使用例**:
```powershell
git diff                    # ワーキング vs ステージング
git diff --staged           # ステージング vs 最新コミット
git diff HEAD               # ワーキング vs 最新コミット
git diff branch1..branch2   # ブランチ間の差分
git diff abc1234..def5678   # コミット間の差分
```

**読み方**:
```diff
- 削除された行（赤）
+ 追加された行（緑）
```

**学んだ日**: 2026-01-03

---

# GitHub - 基礎

## リポジトリ

**説明**: プロジェクトのコードとその履歴を保存する場所

**種類**:
| 種類 | 説明 |
|------|------|
| Public | 誰でも閲覧可能 |
| Private | 招待されたメンバーのみ閲覧可能 |

**主要なファイル**:
| ファイル | 用途 |
|----------|------|
| `README.md` | プロジェクト説明 |
| `.gitignore` | Git追跡対象外の指定 |
| `LICENSE` | ライセンス |
| `.github/` | GitHub固有設定（Actions、テンプレート等） |

### `.gitignore`（生成物をコミットしない）
**説明**: テスト実行で生成される成果物（例: `playwright-report/`, `test-results/`）は、リポジトリを汚しやすいので通常は追跡しない。

**使用例**:
```gitignore
# Playwright
**/playwright-report/
**/test-results/
```

**関連**: 生成物が混ざりそうな作業では `git add <対象ファイル>` の明示指定が安全。

**学んだ日**: 2026-01-03

---

## Issue

**説明**: バグ報告、機能要望、タスク管理に使う

**使い方**:
- バグ報告: 再現手順、期待動作、実際の動作を書く
- 機能要望: 背景、解決したい課題、提案を書く
- タスク: チェックリスト形式で進捗管理

**ラベル例**:
| ラベル | 意味 |
|--------|------|
| `bug` | バグ |
| `enhancement` | 機能改善 |
| `documentation` | ドキュメント |
| `good first issue` | 初心者向け |

**学んだ日**: 2026-01-03

---

# GitHub - Pull Request

## PRとは

**説明**: 変更をレビューしてもらい、mainブランチに取り込むための仕組み

**フロー**:
```
1. ブランチ作成 → 2. 変更をpush → 3. PR作成 → 4. レビュー → 5. マージ
```

**良いPRの書き方**:
```markdown
## Summary
何を変更したか

## WHY
なぜこの変更が必要か（Options → 結論）

## VERIFY
テスト方法、確認手順

## RISK
リスクと対処法

## Docs
ドキュメント更新有無
```

**学んだ日**: 2026-01-03

---

# GitHub - Actions

## 概要

**説明**: CI/CD（継続的インテグレーション/デリバリー）を自動化する仕組み

**用途**:
- 自動テスト実行
- 自動ビルド
- 自動デプロイ
- コード品質チェック

**ファイル配置**: `.github/workflows/*.yml`

**基本構造**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

**学んだ日**: 2026-01-03

---

# GitHub Copilot

## 概要

**説明**: AIによるコード補完・生成ツール

**機能**:
| 機能 | 説明 |
|------|------|
| Code Completion | コード入力中に候補を提案 |
| Copilot Chat | 対話形式でコード質問・生成 |
| Copilot CLI | ターミナルでのAIアシスタント |

**学んだ日**: 2026-01-03

---

## Copilot CLI

**説明**: ターミナル上で動作するCopilotアシスタント

**できること**:
- コマンドの説明・提案
- コード生成・編集
- ファイル操作
- Git操作の補助

**カスタマイズ**:
- `.github/copilot-instructions.md`: プロジェクト固有の指示
- Skills: 特定タスクの自動化（例: 学習ログ更新）

### Skills管理（Copilot CLI の `/skills`）

**説明**: Copilot CLIではVS Codeの「Reload」ではなく、CLI内の `/skills` コマンドでskillの追加・再読込を行う。

**使用例**:
```text
/skills list
/skills add .github\skills\update-learning-logs
/skills reload
/skills info update-learning-logs
```

**関連コマンドとの違い**:
- `/skills add <path>`: skillを登録する
- `/skills reload`: 登録済みskillを再読込する
- `/skills list`: 登録済みskillを一覧表示する

### `/add-dir` との違い

**説明**: `/add-dir` は「Copilotがファイルアクセスして良いディレクトリ（許可リスト）」を追加するコマンドで、skill登録とは別。

**よくある混同**:
```text
/add-dir .github\skills\update-learning-logs   # ❌ skillは追加されない
/skills add .github\skills\update-learning-logs # ✅ skill追加
```

### SKILL.md（YAML frontmatter）の互換性

**説明**: `SKILL.md` のYAML frontmatterは環境によって厳格に検証されることがある。

**ポイント**:
- 必須: `name`, `description`
- Copilot CLIでは追加キー（例: `metadata`）があると読み込みに失敗するケースがある
- 互換性重視なら frontmatter は最小構成（`name`,`description`のみ）にして、追加情報は本文に書く

### 複数ファイル更新（multi-file）

**説明**: 1回のskill実行で複数の学習ログ（PowerShell/cmd, Git/GitHub, AWS, TS, Next.js, Playwright）をまとめて更新できる。

**注意**:
- commitする場合は、生成物（例: `playwright-report/`, `test-results/`）を誤ってstageしない
- `git add <対象ファイル>` の明示指定が安全

**学んだ日**: 2026-01-03

---

## MCP (Model Context Protocol)

**説明**: Copilotに外部ツールや情報源を接続する仕組み

**用途例**:
- データベース接続
- API連携
- カスタムツール追加

**学んだ日**: 2026-01-03

---
