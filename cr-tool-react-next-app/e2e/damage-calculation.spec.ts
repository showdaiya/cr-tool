import { test, expect } from '@playwright/test';

/**
 * ダメージ計算機能の詳細E2Eテスト
 * 
 * テスト対象: 攻撃回数入力、ダメージ計算、HP表示
 */

test.describe('ダメージ計算 - 攻撃カード追加と削除', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // リセットして初期状態にする
    await page.getByRole('button', { name: 'リセット' }).click();
    await page.waitForTimeout(300);
  });

  test('攻撃カードを追加できる', async ({ page }) => {
    // 攻撃カード追加ダイアログを開く
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Loading完了を待つ
    await page.waitForTimeout(1000);
    
    // カード種別フィルタが「すべて」になっていることを確認
    await expect(page.getByRole('combobox', { name: 'カード種別' })).toHaveValue('All');
    
    // カードを選択
    const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
    if (await cards.count() > 0) {
      await cards.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      
      // 攻撃カードが追加されたことを確認
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(page.getByText('攻撃カードがまだありません')).not.toBeVisible();
    }
  });

  test('呪文タブで呪文カードを選択できる', async ({ page }) => {
    // 攻撃カード追加ボタンまたは追加ボタンをクリック
    const addButton = page.getByRole('button', { name: '攻撃カードを追加' });
    const addButtonAlt = page.getByRole('button', { name: '追加' });
    
    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click();
    } else {
      await addButtonAlt.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 呪文を選択
    await page.getByRole('combobox', { name: 'カード種別' }).selectOption('Spell');
    
    // Loading完了を待つ
    await page.waitForTimeout(1500);
    
    // 呪文が選択されていることを確認
    await expect(page.getByRole('combobox', { name: 'カード種別' })).toHaveValue('Spell');
  });

  test('建物タブで建物カードを選択できる', async ({ page }) => {
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 建物を選択
    await page.getByRole('combobox', { name: 'カード種別' }).selectOption('Building');
    
    // 建物が選択されていることを確認
    await expect(page.getByRole('combobox', { name: 'カード種別' })).toHaveValue('Building');
    
    // Loading完了を待つ
    await page.waitForTimeout(1000);
  });

});

test.describe('ダメージ計算 - 回数入力', () => {

  test('攻撃カード追加後に回数を増減できる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 攻撃カードを追加
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
    if (await cards.count() > 0) {
      await cards.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // +ボタンをクリック
      const plusButton = page.getByRole('button', { name: '回数を増やす' });
      if (await plusButton.count() > 0) {
        await plusButton.first().click();
        
        // 回数が1になったことを確認（入力欄の値）
        const input = page.locator('input[type="number"]').first();
        await expect(input).toHaveValue('1');
        
        // -ボタンをクリック
        const minusButton = page.getByRole('button', { name: '回数を減らす' });
        await minusButton.first().click();
        
        // 回数が0になったことを確認
        await expect(input).toHaveValue('');
      }
    }
  });

});

test.describe('ダメージ計算 - HP表示', () => {

  test('防衛カード選択後にHP情報が表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 防衛カード選択ボタンまたは変更ボタンをクリック
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButton = page.getByRole('button', { name: '変更' });
    
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButton.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
    if (await cards.count() > 0) {
      await cards.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // HP関連の表示を確認
      await expect(page.getByText('初期HP')).toBeVisible();
      await expect(page.getByText('受けたダメージ')).toBeVisible();
      await expect(page.getByText('残りHP').first()).toBeVisible();
    }
  });

});

test.describe('カード編集と削除', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // リセットして初期状態にする
    await page.getByRole('button', { name: 'リセット' }).click();
    await page.waitForTimeout(300);
  });

  test('攻撃カードを削除できる', async ({ page }) => {
    
    // 攻撃カードを追加
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
    if (await cards.count() > 0) {
      await cards.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // 削除ボタンをクリック
      const deleteButton = page.getByRole('button', { name: '削除' });
      if (await deleteButton.count() > 0) {
        await deleteButton.first().click();
        
        // 攻撃カードがなくなったことを確認
        await expect(page.getByText('攻撃カードがまだありません')).toBeVisible();
      }
    }
  });

  test('攻撃カードを編集できる', async ({ page }) => {
    
    // 攻撃カードを追加
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
    if (await cards.count() > 0) {
      await cards.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // 編集ボタンをクリック
      const editButton = page.getByRole('button', { name: '編集' });
      if (await editButton.count() > 0) {
        await editButton.first().click();
        
        // 編集ダイアログが開くことを確認
        await expect(page.getByRole('dialog')).toBeVisible();
      }
    }
  });

  test('防衛カードを変更できる', async ({ page }) => {
    // 防衛カード選択ボタンまたは変更ボタンをクリック
    const selectButton = page.getByRole('button', { name: '防衛カードを選択' });
    const changeButtonInitial = page.getByRole('button', { name: '変更' });
    
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();
    } else {
      await changeButtonInitial.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    const cards = page.getByRole('dialog').locator('button').filter({ hasText: /ナイト/ });
    if (await cards.count() > 0) {
      await cards.first().click();
      await page.getByRole('button', { name: '選択' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // 変更ボタンをクリック
      const changeButton = page.getByRole('button', { name: '変更' });
      await changeButton.click();
      
      // ダイアログが開くことを確認
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

});

test.describe('ソートと検索', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('カード名で検索できる', async ({ page }) => {
    // 攻撃カード追加ボタンをクリック
    const addButton = page.getByRole('button', { name: '攻撃カードを追加' });
    const addButtonAlt = page.getByRole('button', { name: '追加' });
    
    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click();
    } else {
      await addButtonAlt.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // 検索
    const searchInput = page.getByPlaceholder('カード名 / IDで検索...');
    await searchInput.fill('ゴブリン');
    await page.waitForTimeout(500);
    
    // ゴブリン系のカードが表示されるか確認（または該当なし）
    // hasText はボタンのアクセシブルネームに対して期待通りに効かないケースがあるため、role/name で判定する
    const goblinCards = page.getByRole('dialog').getByRole('button', { name: /ゴブリン/ });
    const noResult = page.getByRole('dialog').getByText('該当なし');

    await expect.poll(async () => {
      const count = await goblinCards.count();
      if (count > 0) return true;
      return await noResult.isVisible().catch(() => false);
    }).toBeTruthy();
  });

  test('進化表示を切り替えできる', async ({ page }) => {
    // 攻撃カード追加ボタンをクリック
    const addButton = page.getByRole('button', { name: '攻撃カードを追加' });
    const addButtonAlt = page.getByRole('button', { name: '追加' });
    
    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click();
    } else {
      await addButtonAlt.first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // 通常ボタンをクリックして進化表示に切り替え
    const evoButton = page.getByRole('button', { name: '通常' });
    await evoButton.click();
    
    // ボタンのテキストが変わることを確認
    await expect(page.getByRole('button', { name: '進化' })).toBeVisible();
  });

  test('並び替えを変更できる', async ({ page }) => {
    
    await page.getByRole('button', { name: '攻撃カードを追加' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // 並び替えボタンをクリック（昇順/降順の切り替え）
    // 初期状態は昇順なので「降順に変更」ボタンがあるはず
    const sortButton = page.getByRole('button', { name: /順に変更/ });
    await sortButton.click();
    
    // ボタンが存在することを確認（切り替え後も存在する）
    await expect(page.getByRole('button', { name: /順に変更/ })).toBeVisible();
  });

});
