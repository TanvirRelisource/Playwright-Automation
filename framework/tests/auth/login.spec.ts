import { test, expect } from '@playwright/test';
import { admin, invalid } from '../../src/data/users';
import { loginFlow, loginInvalidFlow, loginEmptyFlow } from '../../src/flows/auth';

test.describe('Login', () => {
  test('process validation (steps contain scenarios) [with screenshots]', async ({ page }) => {
    await page.context().tracing.start({ screenshots: true, snapshots: true });
    await test.step('Scenario #1: valid credentials → dashboard', async () => {
      await loginFlow(page, admin);
      await expect(page).toHaveURL(/\/dashboard/i);

      await test.info().attach('Scenario 1 - valid credentials', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('Scenario #2: invalid credentials → error', async () => {
      await page.context().clearCookies();
      await loginInvalidFlow(page, invalid);

      await test.info().attach('Scenario 2 - invalid credentials', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('Scenario #3: empty credentials → required', async () => {
      await page.context().clearCookies();
      await loginEmptyFlow(page);

      await test.info().attach('Scenario 3 - empty credentials', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
    await page.context().tracing.stop({ path: './framework/test-results/Login.zip' });
  });
});