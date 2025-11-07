// ... existing code ...
import type { Page } from '@playwright/test';
import { deleteEmployeeLocators } from '../locators/delete_employee_locator';

type DeleteLocators = ReturnType<typeof deleteEmployeeLocators>;

export async function searchEmployeeByName(
  del: DeleteLocators,
  page: Page,
  fullName: string
): Promise<void> {
  await del.employeeNameHint.fill(fullName);
  await del.searchButton.click();
}

export async function confirmDelete(del: DeleteLocators): Promise<void> {
  await del.deleteButton.click();
  await del.confirmDeleteButton.click();
}
// ... existing code ...