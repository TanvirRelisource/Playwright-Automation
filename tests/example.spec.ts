import { test, expect } from '@playwright/test';

/* test.beforeEach(async ({ context }) => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });
}); */

/* test.afterEach(async ({ context }, testInfo) => {
  await context.tracing.stop({
    path: testInfo.outputPath('test3_trace.zip'),
  });
}); */

test('has title', async ({page}) => {
  
  
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
  // await context.tracing.stop({
  //   path: 'test1_trace.zip'
  // });
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
