// Module: deleteEmployeeLocators
import type { Page, Locator } from '@playwright/test';

export function deleteEmployeeLocators(page: Page): {
  employeeListLink: Locator;
  employeeInformationHeader: Locator;
  searchButton: Locator;
  employeeNameHint: Locator;
  recordFoundText: Locator;
  gridText: (text: string) => Locator;
  deleteButton: Locator;
  confirmDeleteButton: Locator;
  firstNameColumnHeader: Locator;
  actionsColumnHeader: Locator;
} {
  return {
    employeeListLink: page.getByRole('link', { name: 'Employee List' }),
    employeeInformationHeader: page.getByRole('heading', { name: 'Employee Information' }),
    searchButton: page.getByRole('button', { name: 'Search' }),
    employeeNameHint: page.getByRole('textbox', { name: 'Type for hints...' }).first(),
    recordFoundText: page.getByText('Record Found'),
    gridText: (text: string) => page.getByText(text),
    deleteButton: page.getByRole('button', { name: '' }),
    confirmDeleteButton: page.getByRole('button', { name: ' Yes, Delete' }),
    firstNameColumnHeader: page.getByRole('columnheader', { name: 'First (& Middle) Name ' }),
    actionsColumnHeader: page.getByRole('columnheader', { name: 'Actions' }),
  };
}