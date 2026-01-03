# ブラウザ操作MCP導入ガイド

## 概要

MCP（Model Context Protocol）を使用してブラウザ自動操作を行い、E2Eテストを自動化する方法をまとめます。

---

## 推奨ツール: Playwright MCP Server

### なぜPlaywrightか？

| 項目 | Playwright | Puppeteer |
|------|------------|-----------|
| ブラウザサポート | Chromium, Firefox, WebKit | Chromium中心 |
| 言語サポート | JS/TS, Python, Java, .NET | JS/TS |
| クロスプラットフォーム | ◎ | △ |
| Auto-Wait機能 | あり | なし |
| テストランナー内蔵 | あり | なし |
| 並列実行 | ネイティブサポート | 外部ツール必要 |
| MCP対応 | 公式（Microsoft） | コミュニティ |

**結論**: クロスブラウザ対応、AI/LLM統合、将来性を考慮し **Playwright MCP** を推奨。

---

## 前提条件

- **Node.js**: v18以上
- **VS Code**: v1.99以上（MCP/Copilot最新機能対応）
- **GitHub Copilot**: アクティブなサブスクリプション

---

## セットアップ手順

### Step 1: Playwrightのインストール

```bash
cd cr-tool-react-next-app
npm init playwright@latest
```

インストール時の質問：
- TypeScriptを選択
- テストフォルダ: `e2e` または `tests/e2e`
- GitHub Actionsワークフロー: Yes
- ブラウザのインストール: Yes

### Step 2: MCP Server設定（VS Code）

#### 方法A: ワークスペース設定（推奨）

`.vscode/mcp.json` を作成:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}
```

#### 方法B: 特定ブラウザを指定する場合

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--browser", "chromium"],
      "type": "stdio"
    }
  }
}
```

ブラウザオプション:
- `chromium` (デフォルト)
- `firefox`
- `webkit` (Safari)
- `msedge`

### Step 3: Copilot Agent Modeでの使用

1. **Copilot Chat を開く**: `Ctrl+Shift+I`
2. **Agent Mode に切り替え**: ドロップダウンから「Agent」を選択
3. **ツール確認**: 設定から `microsoft/playwright-mcp` が有効か確認
4. **MCPサーバー起動**: 再生ボタンをクリック

---

## 使用例

### 自然言語でテスト生成

Copilot Agent Modeで以下のようにプロンプト:

```
ホームページにアクセスして、防衛カード選択ボタンが存在することを確認するテストを作成して
```

```
攻撃カードを追加し、回数を3に設定した後、合計ダメージが正しく計算されることをテストして
```

### デバッグ

```
このバグを再現して: ダークモードで残りHPの色が見づらい
```

---

## プロジェクト固有の設定

### playwright.config.ts 例

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // モバイル
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### package.json スクリプト追加

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## GitHub Actions CI統合

`.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: cr-tool-react-next-app

    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: cr-tool-react-next-app/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: cr-tool-react-next-app/playwright-report/
          retention-days: 30
```

---

## テスト例（このプロジェクト用）

### e2e/damage-calculator.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('ダメージ計算機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('防衛カード選択ができる', async ({ page }) => {
    // 防衛カード選択ボタンをクリック
    await page.getByRole('button', { name: /防衛カードを選択|変更/ }).click();
    
    // ダイアログが開く
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // カードを検索
    await page.getByPlaceholder('カード名で検索').fill('ナイト');
    
    // カードを選択
    await page.getByText('ナイト').first().click();
    
    // 決定ボタン
    await page.getByRole('button', { name: '決定' }).click();
    
    // ダイアログが閉じる
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('攻撃カード追加でダメージ計算される', async ({ page }) => {
    // 攻撃カード追加
    await page.getByRole('button', { name: /攻撃カードを追加/ }).click();
    await page.getByPlaceholder('カード名で検索').fill('ファイアボール');
    await page.getByText('ファイアボール').first().click();
    await page.getByRole('button', { name: '決定' }).click();
    
    // 回数を増やす
    await page.getByLabel('回数を増やす').first().click();
    
    // 合計ダメージが0より大きい
    const totalDamage = page.locator('text=合計ダメージ').locator('..').getByText(/\d+/);
    await expect(totalDamage).not.toHaveText('0');
  });

  test('HP 0で撃破表示', async ({ page }) => {
    // 大量のダメージを与えるシナリオ
    // ...テスト実装
    
    await expect(page.getByText('撃破！')).toBeVisible();
  });
});

test.describe('レスポンシブ対応', () => {
  test('モバイル表示でも操作可能', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // タップ可能な領域が44px以上
    const button = page.getByRole('button', { name: /防衛カードを選択/ });
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('ダークモード', () => {
  test('ダークモードで視認性が保たれる', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    // コントラスト比の確認（視覚的回帰テスト）
    await expect(page).toHaveScreenshot('dark-mode-home.png');
  });
});
```

---

## トラブルシューティング

### MCPサーバーが起動しない

```bash
# Node.jsバージョン確認
node --version  # v18以上

# キャッシュクリア
npx clear-npx-cache

# 直接実行テスト
npx @playwright/mcp@latest
```

### ブラウザがインストールされていない

```bash
npx playwright install
```

### WSL環境での問題

```bash
# 依存関係インストール
npx playwright install-deps
```

---

## 参考リンク

- [Playwright MCP Server (GitHub)](https://github.com/microsoft/playwright-mcp)
- [GitHub Copilot Agent Mode + MCP](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp)
- [Playwright公式ドキュメント](https://playwright.dev/docs/intro)
- [VS Code MCP設定ガイド](https://4sysops.com/archives/install-microsoft-playwright-mcp-server-in-vs-code-for-ai-powered-browser-automation-in-github-copilot-agent-mode/)

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-03 | 初版作成 |
