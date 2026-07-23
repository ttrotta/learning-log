import { test, expect } from '@playwright/test';

test('homepage renders successfully', async ({ page }) => {
  await page.goto('/');

  // Wait for the app root to be rendered
  const appRoot = page.locator('app-root');
  await expect(appRoot).toBeVisible();
});
