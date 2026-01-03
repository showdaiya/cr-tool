# Command Learning Log

PowerShell/Git コマンドの学習記録（カテゴリ別）。

---

# 目次

- [Git - 基礎概念](#git---基礎概念)
- [Git - ブランチ操作](#git---ブランチ操作)
- [Git - ステージング・コミット](#git---ステージングコミット)
- [Git - リモート操作](#git---リモート操作)
- [Git - 状態確認](#git---状態確認)

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

## `git --no-pager`

**説明**: ページャー（less等）を使わずに直接出力

**使用例**:
```powershell
git --no-pager status
git --no-pager log --oneline -5
git --no-pager diff
```

**なぜ使う？**:
- CLI/スクリプトで出力をそのまま取得したい
- ページャーの操作が不要な短い出力

**永続設定**:
```powershell
git config --global core.pager ""
```

**学んだ日**: 2026-01-03

---
