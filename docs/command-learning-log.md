# Command Learning Log

PowerShell / cmd コマンドの学習記録（カテゴリ別）。

---

# 目次

- [PowerShell - 基礎概念](#powershell---基礎概念)
- [PowerShell - ファイル操作](#powershell---ファイル操作)
- [PowerShell - ディレクトリ操作](#powershell---ディレクトリ操作)
- [PowerShell - プロセス管理](#powershell---プロセス管理)
- [PowerShell - 環境変数](#powershell---環境変数)

---

# PowerShell - 基礎概念

## PowerShellとは

**説明**: Windows標準のコマンドラインシェル。従来のcmd.exeより高機能。

**cmdとの違い**:
| 項目 | cmd | PowerShell |
|------|-----|------------|
| オブジェクト | テキストベース | オブジェクトベース |
| コマンド名 | 短い（`dir`） | 動詞-名詞形式（`Get-ChildItem`） |
| パイプ | テキスト渡し | オブジェクト渡し |
| スクリプト | バッチファイル(.bat) | .ps1ファイル |

**エイリアス**: PowerShellではcmdコマンドも使える（エイリアス）
```powershell
dir    → Get-ChildItem
cd     → Set-Location
del    → Remove-Item
copy   → Copy-Item
```

**学んだ日**: 2026-01-03

---

## コマンドレットの命名規則

**説明**: PowerShellのコマンドは「動詞-名詞」形式

**よく使う動詞**:
| 動詞 | 意味 | 例 |
|------|------|-----|
| `Get` | 取得 | `Get-ChildItem` |
| `Set` | 設定 | `Set-Location` |
| `New` | 作成 | `New-Item` |
| `Remove` | 削除 | `Remove-Item` |
| `Copy` | コピー | `Copy-Item` |
| `Move` | 移動 | `Move-Item` |

**学んだ日**: 2026-01-03

---

## `npx`
**説明**: npmに同梱される「ローカルに入っているCLIを実行する」ためのコマンド（例: Playwright）。

**使用例**:
```powershell
# Playwright の実行
npx playwright test

# バージョン確認
node -v
npm -v
npx playwright --version
```

**よくあるエラーと対処**:
- `No tests found` が出たら、引数（特にWindowsの `\`）が「正規表現として解釈」されていないか確認し、`e2e/damage-calculation.spec.ts` のように `/` 区切りで指定する。
- さらに確実にするなら、ファイルパス指定を避けて `--project` + `--grep "テスト名"` で絞り込む（例: `npx playwright test --project="iPhone 17 (assumed)" --grep "モバイルサイズでも主要要素が表示される"`）。

**学んだ日**: 2026-01-03

---

## `&&`

**説明**: コマンドを連結して実行する演算子（左のコマンドが成功したときだけ右を実行）。

**使用例**:
```powershell
git --no-pager status -sb && git checkout main && git pull --ff-only
```

**関連コマンドとの違い**:
- `;`: 成功/失敗に関係なく順番に実行する。

**学んだ日**: 2026-01-03

---

## `pushd` / `popd`

**説明**: カレントディレクトリを一時的に移動し、最後に元の場所へ戻すためのコマンド。

**基礎知識**:
- `pushd <path>` で「現在の場所」をスタックに積んでから移動する
- `popd` でスタックから取り出して元の場所へ戻る

**使用例**:
```powershell
pushd cr-tool-react-next-app
npm run lint
npm run test
popd
```

**使いどころ**:
- ルート→サブディレクトリへ移動して作業し、確実に戻りたいとき
- スクリプト/CIで `cd` を多用して作業ディレクトリが崩れるのを防ぐとき

**学んだ日**: 2026-01-04

---

# PowerShell - ファイル操作

## `Get-Content`

**説明**: ファイルの内容を読み取る

**使用例**:
```powershell
Get-Content file.txt
Get-Content file.txt -Head 10    # 先頭10行
Get-Content file.txt -Tail 5     # 末尾5行
```

**学んだ日**: 2026-01-03

---

## `Remove-Item`

**説明**: ファイルやディレクトリを削除

**使用例**:
```powershell
Remove-Item file.txt
Remove-Item -Recurse -Force folder/    # フォルダごと強制削除
```

**オプション**:
| オプション | 意味 |
|-----------|------|
| `-Recurse` | 再帰的に削除 |
| `-Force` | 強制削除 |

**注意**: `-Force` は確認なしで削除するため危険

**学んだ日**: 2026-01-03

---

## `Copy-Item`

**説明**: ファイルやディレクトリをコピー

**使用例**:
```powershell
Copy-Item file.txt backup.txt
Copy-Item -Recurse folder/ backup/
```

**学んだ日**: 2026-01-03

---

## `Move-Item`

**説明**: ファイルやディレクトリを移動（名前変更にも使える）

**使用例**:
```powershell
Move-Item file.txt newname.txt        # 名前変更
Move-Item file.txt subfolder/         # 移動
```

**学んだ日**: 2026-01-03

---

# PowerShell - ディレクトリ操作

## `Get-ChildItem`

**説明**: ディレクトリ内のファイル・フォルダ一覧を表示

**使用例**:
```powershell
Get-ChildItem                    # カレントディレクトリ
Get-ChildItem -Recurse           # 再帰的に
Get-ChildItem *.txt              # パターン指定
Get-ChildItem -Hidden            # 隠しファイル含む
```

**エイリアス**: `ls`, `dir`

**学んだ日**: 2026-01-03

---

## `Set-Location`

**説明**: カレントディレクトリを変更

**使用例**:
```powershell
Set-Location C:\Users\
Set-Location ..                  # 親ディレクトリ
Set-Location -                   # 直前のディレクトリ
```

**エイリアス**: `cd`

**学んだ日**: 2026-01-03

---

## `New-Item`

**説明**: ファイルやディレクトリを作成

**使用例**:
```powershell
New-Item -ItemType File -Name "file.txt"
New-Item -ItemType Directory -Name "newfolder"
```

**学んだ日**: 2026-01-03

---

# PowerShell - プロセス管理

## `Get-Process`

**説明**: 実行中のプロセス一覧を表示

**使用例**:
```powershell
Get-Process
Get-Process -Name node
Get-Process -Id 1234
```

**学んだ日**: 2026-01-03

---

## `Stop-Process`

**説明**: プロセスを終了

**使用例**:
```powershell
Stop-Process -Id 1234            # PIDで指定（推奨）
Stop-Process -Name notepad       # 名前で指定（複数終了の可能性）
```

**注意**: `-Name` は同名プロセスを全て終了するため注意

**学んだ日**: 2026-01-03

---

# PowerShell - 環境変数

## `$env:`

**説明**: 環境変数へのアクセス

**使用例**:
```powershell
$env:PATH                        # PATH確認
$env:USERNAME                    # ユーザー名
$env:MY_VAR = "value"           # 一時設定（セッション内のみ）
```

**学んだ日**: 2026-01-03

---
