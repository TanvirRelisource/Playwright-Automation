import { test, expect } from '@playwright/test';
import loginData from '../../Data/login.json';
import { loginLocators } from '../../src/locators/login_locator';
import { loginWithCredentials } from '../../src/functions/login';
const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
test.describe('Login', () => {
    test('process validation (steps contain scenarios) [with screenshots]', async ({ page }) => {
        await test.step('Scenario #1: valid credentials → dashboard', async () => {
            await page.goto(LOGIN_URL);
            const loc = loginLocators(page);
            await expect(loc.usernameInput).toBeVisible();
            await loginWithCredentials(page, {
                username: loginData.validUsername,
                password: loginData.validPassword,
            });
            await expect(loc.dashboardLink).toBeVisible();
            await expect(loc.employeeDistributionByLocationWidget).toBeVisible();
            await expect(loc.dashboardHeading).toBeVisible();


            await test.info().attach('Scenario 1 - valid credentials', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });
        await test.step('Scenario #2: invalid credentials → error', async () => {
            await page.context().clearCookies();
            await page.goto(LOGIN_URL);
            const loc = loginLocators(page);
            await expect(loc.usernameInput).toBeVisible();
            await loginWithCredentials(page, {
                username: loginData.validUsername,
                password: loginData.wrongPassword,
            });
            await expect(loc.loginButton).toBeVisible();
            await expect(loc.invalidCredentialsMessage).toBeVisible();
            await test.info().attach('Scenario 2 - invalid credentials', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });
        await test.step('Scenario #3: empty credentials → required', async () => {
            await page.context().clearCookies();
            await page.goto(LOGIN_URL);
            const loc = loginLocators(page);
            await expect(loc.usernameInput).toBeVisible();
            await loginWithCredentials(page, {
                username: loginData.emptyUsername,
                password: loginData.emptyPassword,
            });
            // Replacements for the two assertions:
            await expect(loc.requiredValidationMessages.first()).toBeVisible();
            await expect(loc.requiredValidationMessages.nth(1)).toBeVisible();
            await test.info().attach('Scenario 3 - empty credentials', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });
    });
});

