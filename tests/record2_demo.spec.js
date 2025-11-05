import { test, expect } from '@playwright/test';
const { chromium } = require('@playwright/test');

test('record demo test', async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator('body').click();
  await page.locator('body').click();
  await page.goto('https://www.saucedemo.com/');
  // await expect(page.locator('#login_button_container')).toMatchAriaSnapshot(`
  //   - textbox "Username"
  //   - textbox "Password"
  //   - button "Login"
  //   `);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  // ---------------------
  await context.close();
  await browser.close();
});