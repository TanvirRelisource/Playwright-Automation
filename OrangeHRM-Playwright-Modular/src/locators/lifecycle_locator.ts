import type { Page, Locator } from '@playwright/test';

export function lifecycleLocators(page: Page): {
  pimMenuLink: Locator;
  addEmployeeLink: Locator;
  addEmployeeHeading: Locator;
  saveButton: Locator;
  firstNameInput: Locator;
  lastNameInput: Locator;
  employeeIdInput: Locator;
  personalDetailsHeader: Locator;
  contactDetailsLink: Locator;
} {
  return {
    // PIM navigation
    pimMenuLink: page.getByRole('link', { name: 'PIM' }),
    addEmployeeLink: page.getByRole('link', { name: 'Add Employee' }),
    addEmployeeHeading: page.getByRole('heading', { name: 'Add Employee' }),
    saveButton: page.getByRole('button', { name: 'Save' }),
    firstNameInput: page.getByRole('textbox', { name: 'First Name' }),
    lastNameInput: page.getByRole('textbox', { name: 'Last Name' }),
    employeeIdInput: page.getByRole('textbox').nth(4),
    personalDetailsHeader: page.getByRole('heading', { name: 'Personal Details' }),
    contactDetailsLink: page.getByRole('link', { name: 'Contact Details' }),
  };
}