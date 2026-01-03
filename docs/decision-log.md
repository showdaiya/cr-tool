# Decision Log

プロジェクトの重要な決定事項を記録するログ。

---

## フォーマット

```markdown
## YYYY-MM-DD: [Decision Title]

### Decision
何を決めたか

### Options
| Option | 特徴 | Trade-off |
|--------|------|-----------|
| A | ... | ... |
| B | ... | ... |

### Why
なぜその選択肢を選んだか

### Verify
検証方法・期待結果

### Rollback
戻し方・取り消し手順

---
```

---

## 2026-01-03: docs/decision-log.md と deploy-runbook.md の作成

### Decision
copilot-instructions.md で必須とされているドキュメントの雛形を作成

### Options
| Option | 特徴 | Trade-off |
|--------|------|-----------|
| A: 最小限の雛形 | すぐ使える | 後で拡張が必要かも |
| B: 詳細テンプレート | 丁寧 | 時間がかかる |

### Why
Option A を採用。まず使い始められる状態を優先し、必要に応じて拡張する方針。

### Verify
- `Get-Content docs\decision-log.md` で内容確認
- `Get-Content docs\deploy-runbook.md` で内容確認
- `git status` で新規2ファイルのみ表示されること

### Rollback
```powershell
Remove-Item docs\decision-log.md
Remove-Item docs\deploy-runbook.md
```

---
