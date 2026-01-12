# Playwright Learning Log

Playwright（E2Eテスト）の学習記録（カテゴリ別）。

---

# 目次

- [Playwright - 基礎概念](#playwright---基礎概念)
- [セットアップ](#セットアップ)
- [テストの書き方](#テストの書き方)
- [セレクタ](#セレクタ)
- [アサーション](#アサーション)
- [デバッグ](#デバッグ)

---

# Playwright - 基礎概念

## Playwrightとは

**説明**: Microsoftが開発したE2E（End-to-End）テストフレームワーク

**特徴**:
| 特徴 | 説明 |
|------|------|
| クロスブラウザ | Chromium, Firefox, WebKit対応 |
| 自動待機 | 要素が現れるまで自動で待つ |
| 並列実行 | テストを並列で高速実行 |
| トレース | 失敗時のスクリーンショット、動画 |
| コード生成 | ブラウザ操作からコード自動生成 |

**他ツールとの比較**:
| ツール | 特徴 |
|--------|------|
| Playwright | 最新、高速、Microsoft製 |
| Cypress | シンプル、デバッグしやすい |
| Selenium | 古参、多言語対応 |

**学んだ日**: 2026-01-03

---

## E2Eテストとは

**説明**: アプリケーション全体をユーザー視点でテスト

```
ユーザー操作 → ブラウザ → フロントエンド → API → DB
           ↑___________________________________↓
                      E2Eテストの範囲
```

**テストの種類**:
| 種類 | 範囲 | 速度 | 信頼性 |
|------|------|------|--------|
| Unit | 関数単位 | 速い | 高い |
| Integration | 複数モジュール | 中間 | 中間 |
| E2E | 全体 | 遅い | 最も現実的 |

**学んだ日**: 2026-01-03

---

# セットアップ

## インストール

**説明**: Playwrightの導入方法

```powershell
# 新規プロジェクトに追加
npm init playwright@latest

# 既存プロジェクトに追加
npm install -D @playwright/test
npx playwright install
```

**生成されるファイル**:
```
├── playwright.config.ts   # 設定ファイル
├── tests/
│   └── example.spec.ts    # サンプルテスト
└── tests-examples/
```

**学んだ日**: 2026-01-03

---

## 設定ファイル

**説明**: playwright.config.tsの基本構造

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",           // テストファイルの場所
  timeout: 30000,             // テストのタイムアウト
  retries: 2,                 // 失敗時のリトライ回数
  
  use: {
    baseURL: "http://localhost:3000",
    headless: true,           // ヘッドレスモード
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### devices（プリセット）+ override で「想定デバイス」を追加する
**説明**: `devices['iPhone 12']` のようなプリセットをベースにしつつ、`viewport`/`deviceScaleFactor` だけ上書きすると、既存のUA/touch設定などを保ったままサイズ違いの検証ができる。

**使用例**:
```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "iPhone 17 (assumed)",
      use: {
        ...devices["iPhone 12"],
        viewport: { width: 402, height: 874 },
        deviceScaleFactor: 3,
      },
    },
  ],
});
```

**注意**: project名にスペースや括弧がある場合は `--project="iPhone 17 (assumed)"` のようにクォートすると安全。

**学んだ日**: 2026-01-03

---

## （トラブル）Vitest が Playwright の e2e を拾って失敗する

**症状**: `vitest run` 実行時に `e2e/*.spec.ts` が対象になり、以下のように落ちる。
- `Playwright Test did not expect test.describe() to be called here.`

**原因**: Playwrightの `test.describe` は `@playwright/test` の実行環境でのみ動作するため、Vitestが読み込むとエラーになる。

**対処**: Vitest側で `e2e/**` を除外する（デフォルトのexcludeを上書きしないように `configDefaults.exclude` に追加する）。

**使用例**:
```ts
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "e2e/**", "**/e2e/**"],
  },
});
```

**VERIFY**:
```powershell
npm run test
```
- `tests/**` だけが走り、`e2e/**` が実行されないこと

**学んだ日**: 2026-01-04

---

# テストの書き方

## 基本構造

**説明**: テストファイルの書き方

```typescript
import { test, expect } from "@playwright/test";

test.describe("機能グループ", () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前に実行
    await page.goto("/");
  });

  test("テスト名", async ({ page }) => {
    // テスト内容
    await page.click("button");
    await expect(page.locator("h1")).toHaveText("Hello");
  });
});
```

**学んだ日**: 2026-01-03

---

## ページ操作

**説明**: よく使うページ操作

```typescript
// ナビゲーション
await page.goto("/about");
await page.goBack();
await page.reload();

// クリック
await page.click("button");
await page.click("text=Submit");

// 入力
await page.fill('input[name="email"]', "test@example.com");
await page.type('input[name="search"]', "hello");  // 1文字ずつ

// 選択
await page.selectOption("select", "option1");
await page.check('input[type="checkbox"]');

// 待機
await page.waitForURL("/dashboard");
await page.waitForSelector(".loaded");
await page.waitForTimeout(1000);  // ⚠️ 非推奨：下記参照
```

**学んだ日**: 2026-01-03

---

## waitForTimeout はアンチパターン

**説明**: `page.waitForTimeout(ms)` は固定時間待機であり、フレーキーテストの主原因。状態ベースの待機を使うべき。

**問題点**:
- 環境によって必要な時間が変わる（CI vs ローカル）
- 無駄に長く待つか、足りなくてfailする
- ブラウザごとに差がある（特にFirefox/WebKit）

**代替パターン**:
```typescript
// ❌ Bad: 固定時間待機
await page.waitForTimeout(1000);
const cards = page.getByRole('dialog').locator('button');
if (await cards.count() > 0) { ... }

// ✅ Good: 状態ベース待機
const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
await cards.first().waitFor({ state: 'visible', timeout: 10000 });
if (await cards.count() > 0) { ... }
```

**よくあるパターンと置き換え**:
```typescript
// ダイアログ内のカードリスト表示待ち
await cards.first().waitFor({ state: 'visible', timeout: 10000 });

// どちらかのボタンが表示されるまで待つ
const selectButton = page.getByRole('button', { name: '選択' });
const changeButton = page.getByRole('button', { name: '変更' });
await expect(selectButton.or(changeButton)).toBeVisible({ timeout: 10000 });

// ページ読み込み完了（networkidleよりdomcontentloadedが安定）
await page.waitForLoadState('domcontentloaded');
```

**学んだ日**: 2026-01-12

---

## locator.or() で複数要素のどちらかを待つ

**説明**: 状態によって表示されるボタンが異なる場合、`or()` で「どちらか」を待機できる。

**使用例**:
```typescript
// 「防衛カードを選択」または「変更」ボタンのどちらかを待つ
const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
const changeButton = page.getByRole('button', { name: '変更' });

await expect(selectButton.or(changeButton)).toBeVisible({ timeout: 10000 });

// その後、どちらが表示されているか判定してクリック
if (await selectButton.isVisible().catch(() => false)) {
  await selectButton.click();
} else {
  await changeButton.first().click();
}
```

**ポイント**:
- `or()` は Playwright 1.33+ で利用可能
- `expect(...).toBeVisible()` と組み合わせて状態ベース待機
- `isVisible()` は即時判定（待機しない）なので、先に `toBeVisible()` で待ってから使う

**学んだ日**: 2026-01-12

---

## networkidle vs domcontentloaded

**説明**: `page.waitForLoadState()` のオプションによってブラウザ互換性が異なる。

**オプション比較**:
```typescript
// ネットワークが落ち着くまで待つ（厳格だが遅い・不安定）
await page.waitForLoadState('networkidle');

// DOM構築完了まで待つ（高速・安定）
await page.waitForLoadState('domcontentloaded');

// 全リソース読み込み完了まで待つ
await page.waitForLoadState('load');
```

**Firefoxでの問題**:
- `networkidle` はFirefoxで「ネットワークが完全に静まった」判定が不安定
- WebSocket接続やポーリングがあると永遠に待つことがある
- タイムアウトエラー: `page.waitForLoadState: Test timeout of 30000ms exceeded`

**推奨**:
```typescript
// ❌ Firefoxで不安定
await page.waitForLoadState('networkidle');

// ✅ クロスブラウザで安定
await page.waitForLoadState('domcontentloaded');
// その後、必要な要素の表示を明示的に待つ
await expect(page.getByRole('button', { name: 'リセット' })).toBeVisible();
```

**学んだ日**: 2026-01-12

---

# セレクタ

## セレクタの種類

**説明**: 要素を特定する方法

```typescript
// テキストで選択（推奨）
page.getByText("Click me");
page.getByRole("button", { name: "Submit" });
page.getByLabel("Email");
page.getByPlaceholder("Enter email");
page.getByTestId("submit-button");

// CSSセレクタ
page.locator("button.primary");
page.locator("#submit");
page.locator('[data-testid="card"]');

// 複合
page.locator("article").filter({ hasText: "Hello" });
page.locator("ul > li").nth(2);
page.locator("div").first();
page.locator("div").last();
```

**推奨度**:
| セレクタ | 推奨度 | 理由 |
|----------|--------|------|
| `getByRole` | ⭐⭐⭐ | アクセシビリティ準拠 |
| `getByTestId` | ⭐⭐ | 安定、テスト専用 |
| `getByText` | ⭐⭐ | 可読性高い |
| CSS | ⭐ | 壊れやすい |

### `filter({ hasText })` の落とし穴
**説明**: `locator('button').filter({ hasText: /.../ })` は「見た目のテキスト」ではなく、要素の構造やアクセシブルネームの解釈次第で期待通りにマッチしないことがある（flakyになりやすい）。

**推奨**: ロール/名前で絞る（ダイアログ内などスコープも狭める）。
```ts
const dialog = page.getByRole('dialog');
const goblinCards = dialog.getByRole('button', { name: /ゴブリン/ });
```

### `expect.poll` で「どちらか成立」を待つ
**説明**: 検索結果が「カードが出る」or「該当なし」のどちらでも良い場合、DOM更新を待ちながら判定できる。
```ts
await expect.poll(async () => {
  const count = await goblinCards.count();
  if (count > 0) return true;
  return await dialog.getByText('該当なし').isVisible().catch(() => false);
}).toBeTruthy();
```

**学んだ日**: 2026-01-03

---

### `getByRole` を安定させるためのHTMLセマンティクス
**説明**: Playwrightの `getByRole('button', { name })` は「アクセシブルネーム」に依存するため、クリック可能要素は `role="button"` を付けた `div/li` より、素直に `<button>` を使った方が安定しやすい。

**使用例**:
```tsx
<button type="button" onClick={...}>...</button>
```

**関連**:
- テストは `dialog.getByRole('button', { name: /.../ })` のように書けて読みやすい
- UI側のセマンティクス改善が、そのままテストの安定化につながる

**学んだ日**: 2026-01-03

---

## data-testid

**説明**: テスト専用の識別子

```tsx
// コンポーネント
<button data-testid="submit-button">Submit</button>

// テスト
await page.getByTestId("submit-button").click();
```

**ベストプラクティス**:
- 本番コードには影響しない
- セレクタが安定
- 命名規則: `kebab-case`

**学んだ日**: 2026-01-03

---

# アサーション

## よく使うアサーション

**説明**: 期待値の検証

```typescript
// 可視性
await expect(page.locator("h1")).toBeVisible();
await expect(page.locator(".modal")).toBeHidden();

// テキスト
await expect(page.locator("h1")).toHaveText("Hello");
await expect(page.locator("p")).toContainText("world");

// 属性
await expect(page.locator("button")).toBeEnabled();
await expect(page.locator("button")).toBeDisabled();
await expect(page.locator("input")).toHaveValue("test");
await expect(page.locator("a")).toHaveAttribute("href", "/about");

// 数
await expect(page.locator("li")).toHaveCount(5);

// URL
await expect(page).toHaveURL("/dashboard");
await expect(page).toHaveTitle("Dashboard");

// スクリーンショット比較
await expect(page).toHaveScreenshot("home.png");
```

**学んだ日**: 2026-01-03

---

## 否定

**説明**: 〜でないことを確認

```typescript
await expect(page.locator(".error")).not.toBeVisible();
await expect(page.locator("input")).not.toHaveValue("wrong");
```

**学んだ日**: 2026-01-03

---

# デバッグ

## デバッグ方法

**説明**: テスト失敗時の調査方法

```powershell
# UIモードで実行（推奨）
npx playwright test --ui

# ヘッドありで実行（ブラウザが見える）
npx playwright test --headed

# デバッグモード（ステップ実行）
npx playwright test --debug

# 特定のテストだけ実行
npx playwright test tests/login.spec.ts
npx playwright test --project=chromium --grep "ログイン"

# Windows注意: テストファイル指定は "e2e/damage-calculation.spec.ts" のように / 区切りが安全（\d などが正規表現として解釈されて "No tests found" になり得る）
# 迷ったらファイルパス指定をやめて、`--project` + `--grep "テスト名"` で絞ると安全。
# project名にスペース/括弧がある場合は `--project="iPhone 17 (assumed)"` のようにクォートする。

# レポート表示
npx playwright show-report
```

**学んだ日**: 2026-01-03

---

## UI変更に伴うE2Eテストの修正

**説明**: UIコンポーネントの変更（例: Tabs → Select）により、既存のE2Eテストが壊れることがある。テストはUIの実装詳細ではなく「ユーザーが何をするか」に合わせて修正する。

**今回の事象**:
- `SelectCardOverlay`がTabsコンポーネントからSelectドロップダウンに変更
- `getByRole('tab', { name: 'ユニット' })` が見つからなくなった

**対処**:
```typescript
// Before: Tabs
await page.getByRole('tab', { name: 'ユニット' }).click();
await expect(page.getByRole('tab', { name: 'ユニット' })).toHaveAttribute('data-state', 'active');

// After: Select (combobox)
await page.getByRole('combobox', { name: 'カード種別' }).selectOption('Troop');
await expect(page.getByRole('combobox', { name: 'カード種別' })).toHaveValue('Troop');
```

**ポイント**:
- `<select>` 要素は `getByRole('combobox')` でアクセス
- `aria-label` を付けておくとセレクタが安定（`aria-label="カード種別"`）
- `.selectOption('value')` で選択、`.toHaveValue('value')` で検証

**学んだ日**: 2026-01-04

---

## ボタンテキスト変更とE2Eセレクタの同期

**説明**: UIのボタンテキストを変更した場合、E2Eテストの `getByRole('button', { name: '...' })` も同期して更新が必要。

**今回の事象**:
- 「進化表示」ボタン → 「通常」/「進化」に短縮
- テストが `getByRole('button', { name: '進化表示' })` で要素が見つからずfail

**対処**:
```typescript
// Before
const evoButton = page.getByRole('button', { name: '進化表示' });
await evoButton.click();
await expect(page.getByRole('button', { name: '通常表示' })).toBeVisible();

// After
const evoButton = page.getByRole('button', { name: '通常' });
await evoButton.click();
await expect(page.getByRole('button', { name: '進化' })).toBeVisible();
```

**ポイント**:
- UI変更時は該当テキストをgrep検索して影響範囲を確認
- `getByPlaceholder` も同様（例: 「カード名で検索...」→「カード名 / IDで検索...」）
- テスト側のセレクタはUIの実装に依存するため、変更時は必ず同期

**学んだ日**: 2026-01-04

---

## テキストマッチの厳密化（exact: true）

**説明**: `getByText('ダメージ')` のような部分マッチは、ページ内に「ダメージ」を含む複数の要素がある場合に "strict mode violation" エラーになる。`{ exact: true }` を付けると完全一致になり、意図した要素だけにマッチする。

**事象**:
```
Error: strict mode violation: getByText('ダメージ') resolved to 4 elements:
  1) <h1>クラロワ ダメージシミュレーター</h1>
  2) <span>ダメージ</span>
  3) <p>...合計ダメージを計算します。</p>
  4) <p>© 2024-2025 クラロワ ダメージシミュレーター</p>
```

**対処**:
```typescript
// Before: 部分マッチ（複数ヒット）
await expect(page.getByText('ダメージ')).toBeVisible();

// After: 完全一致
await expect(page.getByText('ダメージ', { exact: true })).toBeVisible();
```

**他の回避策**:
- `.first()` で最初の要素を取得（非推奨：順序依存になる）
- より具体的なセレクタを使う（例: `locator('span').getByText('ダメージ')`）
- `aria-label` を付けて `getByLabel()` で取得

**学んだ日**: 2026-01-11

---

## aria-labelベースのセレクタ

**説明**: UIラベルが絵文字や記号のみの場合、`getByText()` が不安定になる。`aria-label` を付けて `getByLabel()` や `locator('[aria-label="..."]')` でアクセスすると安定する。

**事象**:
- ステータスパネルが `🛡️ 防衛` のようなテキストから、絵文字のみ（`🛡️`）に変更
- `getByText('🛡️ 防衛')` がマッチしなくなった

**対処（HTML側）**:
```tsx
<span className="text-muted-foreground" aria-label="防衛カード">🛡️</span>
```

**対処（テスト側）**:
```typescript
// Before: テキストマッチ
await expect(page.getByText('🛡️ 防衛')).toBeVisible();

// After: aria-labelでアクセス
await expect(page.locator('[aria-label="防衛カード"]')).toBeVisible();
// または
await expect(page.getByLabel('防衛カード')).toBeVisible();
```

**ポイント**:
- `aria-label` はアクセシビリティにも貢献（スクリーンリーダー対応）
- `getByLabel()` は `<label>` 要素とinputの紐付けにも使える
- テストと実装両方でセマンティクスが向上する

**学んだ日**: 2026-01-11

---

## コード生成

**説明**: ブラウザ操作からテストコードを自動生成

```powershell
npx playwright codegen http://localhost:3000
```

**使い方**:
1. ブラウザが開く
2. 手動で操作
3. 右側にコードが生成される
4. コピーしてテストファイルに貼り付け

**学んだ日**: 2026-01-03

---

## トレース

**説明**: テスト実行の詳細記録

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: "on-first-retry",  // 最初のリトライ時に記録
  },
});
```

**トレースの確認**:
```powershell
npx playwright show-trace trace.zip
```

**記録される内容**:
- スクリーンショット（各ステップ）
- DOMスナップショット
- ネットワークログ
- コンソールログ

**学んだ日**: 2026-01-03

---
