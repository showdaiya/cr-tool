# Command Learning Log

PowerShell/Git コマンドの学習記録。

---

## 2026-01-03: docs/フォルダ整備とブランチ運用

### 実行したコマンド
| # | コマンド | 説明 |
|---|----------|------|
| 1 | `git checkout -b docs/add-decision-log-and-runbook` | 新規ブランチ作成 + 切替を同時に行う |
| 2 | `git add docs/decision-log.md docs/deploy-runbook.md` | 指定ファイルをステージング |
| 3 | `git commit -m "docs: ..."` | コミット作成 |
| 4 | `git push -u origin docs/add-decision-log-and-runbook` | リモートにpush + upstream設定 |
| 5 | `git checkout main` | mainブランチに切替 |
| 6 | `git --no-pager status` | 変更状態を確認（ページャーなし） |
| 7 | `git --no-pager log --oneline -1` | 最新コミット1件を1行表示 |
| 8 | `git --no-pager branch` | ブランチ一覧を表示 |

### 学んだこと

#### `-b` オプション（checkout）
```powershell
git checkout -b ブランチ名
```
- ブランチ作成（`git branch`）と切替（`git checkout`）を1コマンドで実行
- 新しいGitでは `git switch -c ブランチ名` も使える

#### upstream（上流）
```powershell
git push -u origin ブランチ名
```
- `-u` = `--set-upstream`
- ローカルブランチとリモートブランチを紐付ける
- 設定後は `git push` / `git pull` だけで済む

#### ブランチ名の `/`
- `docs/add-decision-log` の `/` はフォルダではなく**命名規則**
- 可読性のためにカテゴリを示す（`feat/`, `fix/`, `docs/` など）

#### `--no-pager`
- Gitのデフォルト出力はページャー（less等）を使う
- `--no-pager` でそのまま表示（スクリプトやCLI向け）

### 関連リンク
- [Git公式 - git-checkout](https://git-scm.com/docs/git-checkout)
- [Git公式 - git-push](https://git-scm.com/docs/git-push)

---
