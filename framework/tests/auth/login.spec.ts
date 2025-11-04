import { test, expect } from '@playwright/test';
import { admin, invalid } from '../../src/data/users';
import { loginFlow, loginInvalidFlow, loginEmptyFlow } from '../../src/flows/auth';

test.describe('Login', () => {
  test('valid credentials → dashboard', async ({ page }) => {
    await loginFlow(page, admin);
    await expect(page).toHaveURL(/\/dashboard/i);
  });

  test('invalid credentials → error', async ({ page }) => {
    await loginInvalidFlow(page, invalid);
  });

  test('empty credentials → required', async ({ page }) => {
    await loginEmptyFlow(page);
  });
});