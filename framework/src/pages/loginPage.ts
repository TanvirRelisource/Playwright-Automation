import { Page, expect } from '@playwright/test';
import { baseURL } from '../data/users';
import { loginLocators } from '../locators/login';

export class LoginPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto(baseURL);
        //await this.page.pause();
        await expect(this.page).toHaveURL(/orangehrm/i);
    }

    async login(username: string, password: string) {
        const loc = loginLocators(this.page);
        await loc.username.fill(username);
        await loc.password.fill(password);
        await loc.submit.click();
    }
}