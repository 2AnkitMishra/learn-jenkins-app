// @ts-check
const { test, expect } = require('@playwright/test');

test('has correct title', async ({ page }) => {
  await page.goto('/');

  // Update your index.html title accordingly if needed
  await expect(page).toHaveTitle(/Catch the Bug/i);
});

test('renders game title', async ({ page }) => {
  await page.goto('/');

  const title = page.locator('text=Catch the Bug');
  await expect(title).toBeVisible();
});

test('renders score and time', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('text=Score:')).toBeVisible();
  await expect(page.locator('text=Time:')).toBeVisible();
});

test('bug is visible on screen', async ({ page }) => {
  await page.goto('/');

  const bug = page.locator('text=🐛');
  await expect(bug).toBeVisible();
});

test('score increases when bug is clicked', async ({ page }) => {
  await page.goto('/');

  const bug = page.locator('text=🐛');

  // Click the bug
  await bug.click();

  // Expect score to update
  await expect(page.locator('text=Score: 1')).toBeVisible();
});