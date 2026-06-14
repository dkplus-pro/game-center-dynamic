import { test, expect } from '@playwright/test';

/**
 * H5 Render E2E smoke tests.
 *
 * These tests verify the core H5 rendering pipeline renders without console errors.
 * They require the dev server (port 8081) and backend (port 3000) to be running.
 *
 * The backend is needed for page data fetching (GET /api/pages/:slug).
 *
 * Run with: `pnpm exec playwright test` from apps/h5/
 */

test.describe('H5 Render', () => {
  test('shows error page for non-existent slug', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/non-existent-page-12345');

    // Should show error UI with "页面加载失败" message and "重试" button
    await expect(
      page.locator('text=页面加载失败').or(page.locator('text=重试')),
    ).toBeVisible({ timeout: 15000 });

    // Allow network errors from the failed fetch, but no other console errors
    expect(
      errors.filter(
        (e) => !e.includes('favicon') && !e.includes('Failed to load'),
      ),
    ).toHaveLength(0);
  });

  test('preview page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Load preview with a non-existent pageId — should handle gracefully
    await page.goto('/preview?pageId=test-nonexistent&draft=true');

    // Should show either error or loading state
    await expect(
      page.locator('text=页面加载失败').or(page.locator('text=重试')),
    ).toBeVisible({ timeout: 15000 });

    // Allow network errors from the failed fetch, but no other console errors
    expect(
      errors.filter(
        (e) => !e.includes('favicon') && !e.includes('Failed to load'),
      ),
    ).toHaveLength(0);
  });

  test('root page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // The root URL maps to slug "" which triggers "缺少页面标识" error
    await expect(
      page.locator('text=缺少页面标识').or(page.locator('text=页面加载失败')),
    ).toBeVisible({ timeout: 15000 });

    expect(
      errors.filter((e) => !e.includes('favicon')),
    ).toHaveLength(0);
  });
});