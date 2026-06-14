import { test, expect } from '@playwright/test';

/**
 * Admin Editor E2E smoke tests.
 *
 * These tests verify the core admin UI renders without console errors.
 * They require the dev server (port 8080) and backend (port 3000) to be running.
 * The backend is needed for the page list (GET /api/pages) and page creation.
 *
 * Run with: `pnpm exec playwright test` from apps/admin/
 */

test.describe('Admin Editor', () => {
  test('page list loads and shows empty state or create button', async ({ page }) => {
    // Collect console errors for verification
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // Should show page list UI — either empty state or the create button
    await expect(
      page.locator('text=新建页面').or(page.locator('text=暂无页面')),
    ).toBeVisible({ timeout: 15000 });

    // No console errors (excluding favicon 404 which is normal in dev)
    expect(
      errors.filter((e) => !e.includes('favicon')),
    ).toHaveLength(0);
  });

  test('can create a new page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // Click the "新建页面" button
    const createBtn = page.locator('button', { hasText: '新建页面' });
    await createBtn.click();

    // Should navigate to the editor (URL contains /editor/)
    await page.waitForURL(/\/editor\//, { timeout: 15000 });

    // Verify the three-panel editor layout is visible
    await expect(
      page.locator('text=组件面板').or(page.locator('[class*="component-panel"]')),
    ).toBeVisible({ timeout: 10000 });

    expect(
      errors.filter((e) => !e.includes('favicon')),
    ).toHaveLength(0);
  });

  test('editor shows component panel with draggable items', async ({ page }) => {
    await page.goto('/editor/new');

    // Verify the component panel is visible with its header
    await expect(page.locator('text=组件面板')).toBeVisible({ timeout: 10000 });

    // Verify at least one component type is listed in the panel
    // Banner is labeled "横幅轮播" in Chinese
    const bannerItem = page.locator('text=横幅轮播');
    await expect(bannerItem).toBeVisible({ timeout: 10000 });

    // Verify the three-panel layout: Canvas shows empty state
    await expect(
      page.locator('text=从左侧拖入组件开始搭建'),
    ).toBeVisible({ timeout: 10000 });

    // Verify the props panel (right side) shows placeholder
    await expect(
      page.locator('text=属性面板').or(page.locator('text=点击组件编辑属性')),
    ).toBeVisible({ timeout: 10000 });
  });

  test('editor page has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/editor/new');

    // Wait for the editor to fully render
    await page.waitForTimeout(3000);

    expect(
      errors.filter((e) => !e.includes('favicon')),
    ).toHaveLength(0);
  });
});