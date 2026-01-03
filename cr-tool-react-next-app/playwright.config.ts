import { defineConfig, devices } from '@playwright/test';

/**
 * CR-Tool Playwright設定
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストファイルのディレクトリ
  testDir: './e2e',
  
  // 全テストを並列実行
  fullyParallel: true,
  
  // CI環境で test.only() を禁止
  forbidOnly: !!process.env.CI,
  
  // 失敗時のリトライ回数（CIでは2回）
  retries: process.env.CI ? 2 : 0,
  
  // 並列ワーカー数（CIでは1）
  workers: process.env.CI ? 1 : undefined,
  
  // HTMLレポート出力
  reporter: 'html',
  
  // 共通設定
  use: {
    // 基準URL
    baseURL: 'http://localhost:3000',
    
    // リトライ時にトレースを取得
    trace: 'on-first-retry',
    
    // 失敗時のみスクリーンショット
    screenshot: 'only-on-failure',
    
    // 失敗時のみ動画保持
    video: 'retain-on-failure',
  },

  // ブラウザ/デバイス設定
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
    {
      // iPhone 17 (想定) を手動チェックしやすくするためのプロジェクト
      name: 'iPhone 17 (assumed)',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 402, height: 874 },
        deviceScaleFactor: 3,
      },
    }
  ],

  // 開発サーバー設定
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
