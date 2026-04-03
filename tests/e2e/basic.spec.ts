import { test, expect } from '@playwright/test';

test('landing page exists', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
