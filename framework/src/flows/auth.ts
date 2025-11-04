// Module: auth flows
import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { Credentials } from '../data/users';
import { loginLocators } from '../locators/login';

export async function loginFlow(page: Page, creds: Credentials) {
  const login = new LoginPage(page);
  await login.goto();

  // Fast-success: if already on Dashboard, skip login
  const pimMenu = page.getByRole('link', { name: 'PIM' });
  const onDashboard = await pimMenu.isVisible();

  if (!onDashboard) {
    await login.login(creds.username, creds.password);
  }

  // Settle on a real post-login signal
  await expect(pimMenu).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard/i);
  await expect(loginLocators(page).submit).not.toBeVisible();
}

export async function loginInvalidFlow(page: Page, creds: Credentials) {
  const login = new LoginPage(page);
  const loc = loginLocators(page);

  await login.goto();
  await login.login(creds.username, creds.password);

  await expect(loc.invalidToast).toBeVisible();
  await expect(page).not.toHaveURL(/\/dashboard/i);
}

// Fix: assert both field-level error messages for empty credentials
export async function loginEmptyFlow(page: Page) {
  const login = new LoginPage(page);
  await login.goto();

  const loc = loginLocators(page);
  await loc.submit.click();

  // Assert the two inline error messages under Username and Password
  const fieldErrors = page.locator('.oxd-input-field-error-message');
  await expect(fieldErrors).toHaveCount(2);

  // Confirm we remain on the login page
  await expect(page).not.toHaveURL(/\/dashboard/i);
}

