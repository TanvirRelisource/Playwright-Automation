import type { Page } from '@playwright/test';
import { lifecycleLocators } from '../locators/lifecycle_locator';

export async function openAddEmployee(page: Page): Promise<void> {
  const life = lifecycleLocators(page);
  await life.pimMenuLink.click();
  await life.addEmployeeLink.click();
}

export type EmployeeRequiredFields = {
  firstName: string;
  lastName: string;
  uniqueId: string;
};

export async function fillRequiredEmployeeFieldsAndSave(
  page: Page,
  data: EmployeeRequiredFields
): Promise<void> {
  const life = lifecycleLocators(page);
  await life.firstNameInput.fill(data.firstName);
  await life.lastNameInput.fill(data.lastName);
  await life.employeeIdInput.fill(data.uniqueId);
  await life.saveButton.click();
}