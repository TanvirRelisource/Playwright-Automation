import type { Page, Locator } from '@playwright/test';

export function loginLocators(page: Page): {
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  invalidCredentialsMessage: Locator;
  // Added dashboard-related locators used in login.spec.ts
  dashboardLink: Locator;
  dashboardHeading: Locator;
  employeeDistributionByLocationWidget: Locator;
  requiredValidationMessages: Locator;
} {
  return {
    usernameInput: page.getByRole('textbox', { name: 'Username' }),
    passwordInput: page.getByRole('textbox', { name: 'Password' }),
    loginButton: page.getByRole('button', { name: 'Login' }),
    invalidCredentialsMessage: page.getByText('Invalid credentials', { exact: true }),
    requiredValidationMessages: page.getByText('Required'),

    // New centralized locators matching your spec usage
    dashboardLink: page.getByRole('link', { name: 'Dashboard' }),
    dashboardHeading: page.getByRole('heading', { name: 'Dashboard' }),
    employeeDistributionByLocationWidget: page.getByText('Employee Distribution by Location', { exact: true }),
  };
}