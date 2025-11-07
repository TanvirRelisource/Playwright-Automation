import type { Page } from '@playwright/test';
import { loginLocators } from '../locators/login_locator';
// ... existing code ...

export async function loginWithCredentials(
  page: Page,
  creds: { username: string; password: string }
): Promise<void> {
  const loc = loginLocators(page);
  await loc.usernameInput.fill(creds.username);
  await loc.passwordInput.fill(creds.password);
  await loc.loginButton.click();
}

// ... existing code ...