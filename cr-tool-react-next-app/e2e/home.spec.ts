import { test, expect } from '@playwright/test';

/**
 * CR-Tool ホームページのE2Eテスト
 * 
 * テスト対象: クラロワ ダメージシミュレーターの基本機能
 */

test.describe('ホームページ - 基本表示', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ページの読み込み完了を待つ
    await page.waitForLoadState('domcontentloaded');
  });

  test('アプリタイトルが表示される', async ({ page }) => {
    // h1要素でタイトルを確認
    const title = page.locator('h1').filter({ hasText: 'クラロワ ダメージシミュレーター' });
    await expect(title).toBeVisible();
  });

  test('使い方の説明が表示される', async ({ page }) => {
    const instruction = page.getByText('防衛を選ぶ → 攻撃を追加 → 回数を入力');
    await expect(instruction).toBeVisible();
  });

  test('ヘルプボタンが存在する', async ({ page }) => {
    const helpButton = page.getByRole('button', { name: 'ヘルプ' });
    await expect(helpButton).toBeVisible();
  });

  test('リセットボタンが存在する', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: 'リセット' });
    await expect(resetButton).toBeVisible();
  });

  test('ステータスパネルが表示される', async ({ page }) => {
    // 4つのステータス項目を確認（aria-labelで識別）
    await expect(page.locator('[aria-label="防衛カード"]')).toBeVisible();
    await expect(page.locator('[aria-label="攻撃カード数"]')).toBeVisible();
    await expect(page.locator('[aria-label="合計ダメージ"]')).toBeVisible();
    await expect(page.locator('[aria-label="残りHP"]')).toBeVisible();
  });

  test('防衛カードセクションが表示される', async ({ page }) => {
    const defenseSection = page.locator('#defense-card-section');
    await expect(defenseSection).toBeVisible();
    await expect(page.getByText('防衛カード').first()).toBeVisible();
  });

  test('攻撃カードセクションが表示される', async ({ page }) => {
    await expect(page.getByText('攻撃カード').first()).toBeVisible();
    await expect(page.getByText('追加した攻撃カードの「回数」を入れると合計ダメージを計算します')).toBeVisible();
  });

  test('フッターが表示される', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(page.getByText('© 2024-2025 クラロワ ダメージシミュレーター')).toBeVisible();
  });

});

test.describe('防衛カード選択', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // リセットして初期状態にする
    const resetButton = page.getByRole('button', { name: 'リセット' });
    if (await resetButton.isVisible()) {
      await resetButton.click();
      // リセット完了を待つ（どちらかのボタンが表示されるまで）
      const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
      const changeButton = page.getByRole('button', { name: '変更' });
      await expect(selectButton.or(changeButton)).toBeVisible({ timeout: 5000 });
    }
  });

  test('防衛カード選択ボタンまたは変更ボタンが表示される', async ({ page }) => {
    // 「防衛カードを選択」または「変更」ボタンのいずれかが存在する
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    
    // 状態ベースの待機: どちらかのボタンが表示されるまで待つ
    await expect(selectButton.or(changeButton)).toBeVisible({ timeout: 10000 });
  });

  test('防衛カード選択ダイアログが開く', async ({ page }) => {
    // 「防衛カードを選択」または「変更」ボタンをクリック
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButton.first().click();
    }
    
    // ダイアログが表示されることを確認
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // ダイアログタイトルを確認
    await expect(page.getByRole('heading', { name: '防衛カードを選択' })).toBeVisible();
  });

  test('防衛カード選択ダイアログで検索できる', async ({ page }) => {
    // ダイアログを開く
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButton.first().click();
    }
    
    // ダイアログが開くのを待つ
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 検索入力欄を確認
    const searchInput = page.getByPlaceholder('カード名 / IDで検索...');
    await expect(searchInput).toBeVisible();
    
    // 検索してみる
    await searchInput.fill('ナイト');
    // 検索結果が更新されるのを待つ
    await expect(page.getByRole('dialog').locator('button').first()).toBeVisible({ timeout: 10000 });
  });

  test('防衛カード選択ダイアログでカードを選択できる', async ({ page }) => {
    // ダイアログを開く
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButton.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // カードリストが表示されるまで待つ
    const cardItems = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト|アーチャー|ゴブリン/ });
    await cardItems.first().waitFor({ state: 'visible', timeout: 10000 });
    
    // 最初のカードをクリック（存在する場合）
    const count = await cardItems.count();
    
    if (count > 0) {
      await cardItems.first().click();
      
      // 選択ボタンをクリック
      const confirmButton = page.getByRole('button', { name: '選択' });
      await expect(confirmButton).toBeEnabled();
    }
  });

  test('防衛カード選択ダイアログをキャンセルできる', async ({ page }) => {
    // ダイアログを開く
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButton.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // キャンセルボタンをクリック
    await page.getByRole('button', { name: 'キャンセル' }).click();
    
    // ダイアログが閉じることを確認
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

});

test.describe('攻撃カード操作', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('攻撃カードがない状態で追加ボタンが表示される', async ({ page }) => {
    // 「攻撃カードがまだありません」メッセージ
    await expect(page.getByText('攻撃カードがまだありません')).toBeVisible();
    
    // 追加ボタン
    const addButton = page.getByRole('button', { name: '攻撃カードを追加' });
    await expect(addButton).toBeVisible();
  });

  test('攻撃カード追加ダイアログが開く', async ({ page }) => {
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // 攻撃カード選択のタイトル
    await expect(page.getByRole('heading', { name: '攻撃カードを選択' })).toBeVisible();
  });

  test('攻撃カード選択ダイアログにカード種別選択が表示される', async ({ page }) => {
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // カード種別選択（Select/combobox）が存在
    await expect(page.getByLabel('カード種別')).toBeVisible();
  });

});

test.describe('ヘルプ機能', () => {

  test('ヘルプボタンをクリックすると説明が表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // ヘルプボタンをクリック
    await page.getByRole('button', { name: 'ヘルプ' }).click();
    
    // 使い方の説明が表示される
    await expect(page.getByText('使い方:')).toBeVisible();
    await expect(page.getByText(/防衛カードを選択し、攻撃カードを追加してダメージ計算を行います/)).toBeVisible();
  });

  test('ヘルプを再度クリックすると非表示になる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // ヘルプを開く
    await page.getByRole('button', { name: 'ヘルプ' }).click();
    await expect(page.getByText('使い方:')).toBeVisible();
    
    // ヘルプを閉じる
    await page.getByRole('button', { name: 'ヘルプ' }).click();
    await expect(page.getByText('使い方:')).not.toBeVisible();
  });

});

test.describe('ダメージ計算フロー（統合テスト）', () => {

  test('防衛カードを選択するとステータスが更新される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // リセットして初期状態にする
    await page.getByRole('button', { name: 'リセット' }).click();
    // リセット完了を待つ（どちらかのボタンが表示されるまで）
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    await expect(selectButton.or(changeButton)).toBeVisible({ timeout: 5000 });
    
    // 防衛カード選択ボタンまたは変更ボタンをクリック
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButton.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // カードリストが表示されるまで待つ
    const knightCard = page.getByRole('dialog').locator('button').filter({ hasText: 'ナイト' });
    await knightCard.first().waitFor({ state: 'visible', timeout: 10000 });
    
    // 検索して選択
    await page.getByPlaceholder('カード名 / IDで検索...').fill('ナイト');
    
    // カードをクリック（存在する場合）
    if (await knightCard.count() > 0) {
      await knightCard.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // 防衛カード情報が表示される（変更ボタンが出現）
      await expect(page.getByRole('button', { name: '変更' })).toBeVisible();
    }
  });

  test('リセットボタンで攻撃カードがクリアされる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // リセットボタンをクリック
    await page.getByRole('button', { name: 'リセット' }).click();
    
    // 攻撃カードがない状態を確認
    await expect(page.getByText('攻撃カードがまだありません')).toBeVisible({ timeout: 5000 });
  });

});

test.describe('レスポンシブ対応', () => {

  test('モバイルサイズでも主要要素が表示される', async ({ page }) => {
    // モバイルビューポート設定
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // 主要要素が表示される
    await expect(page.locator('h1').filter({ hasText: 'クラロワ ダメージシミュレーター' })).toBeVisible();
    
    // 防衛カード関連のボタン（選択または変更）が表示される
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    const selectVisible = await selectButton.isVisible().catch(() => false);
    const changeVisible = await changeButton.isVisible().catch(() => false);
    expect(selectVisible || changeVisible).toBeTruthy();
  });

  test('タブレットサイズでも主要要素が表示される', async ({ page }) => {
    // タブレットビューポート設定
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.locator('h1').filter({ hasText: 'クラロワ ダメージシミュレーター' })).toBeVisible();
    
    // 防衛カード関連のボタン（選択または変更）が表示される
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    const selectVisible = await selectButton.isVisible().catch(() => false);
    const changeVisible = await changeButton.isVisible().catch(() => false);
    expect(selectVisible || changeVisible).toBeTruthy();
  });

});
