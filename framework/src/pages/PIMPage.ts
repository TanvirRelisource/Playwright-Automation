import { Page, expect } from "@playwright/test";
import { pimLocators } from "../locators/pim";

export class PIMPage {
  constructor(private page: Page) {}

  async openPIM() {
    const loc = pimLocators(this.page);
    await loc.pimMenu.click();
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList|\/pim/i);
  }
  
  async openEmployeeList() {
    const loc = pimLocators(this.page);
    await loc.employeeListMenu.click();
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/i);
  }

  async openAddEmployee() {
    const loc = pimLocators(this.page);
    await loc.addEmployeeMenu.click();
    await expect(this.page).toHaveURL(/\/pim\/addEmployee/i);
  }
}
