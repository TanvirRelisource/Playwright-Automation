import {Page, Locator} from '@playwright/test';

export function loginLocators(page: Page): {
  username: Locator;
  password: Locator;
  submit: Locator;
  invalidToast: Locator;
  requiredError: Locator;
} {
  return {
    username: page.getByRole('textbox', { name: 'Username' }),
    password: page.getByRole('textbox', { name: 'Password' }),
    submit: page.getByRole('button', { name: 'Login' }),
    invalidToast: page.getByText('Invalid credentials'),
    requiredError: page.getByText('Required'),
  };
}