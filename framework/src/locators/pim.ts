import { Page, Locator } from '@playwright/test';

export function pimLocators(page: Page) {
  const tableBody = page.locator('div.oxd-table-body');
  return {
    pimMenu: page.getByRole('link', { name: 'PIM' }),
    employeeListMenu: page.getByRole('link', { name: 'Employee List' }),
    addEmployeeMenu: page.getByRole('link', { name: 'Add Employee' }),

    // Use the first "Type for hints..." input to avoid strict-mode conflicts
    employeeNameInput: page.getByPlaceholder('Type for hints...').first(),
    searchButton: page.getByRole('button', { name: 'Search' }),
    resetButton: page.getByRole('button', { name: 'Reset' }),

    firstResultCard: tableBody.locator('div.oxd-table-card').first(),
    rowByName: (displayName: string): Locator =>
        tableBody.locator('div.oxd-table-card').filter({ hasText: displayName }).first(),
    rowByNamePrefix: (prefix: string): Locator =>
        tableBody
            .locator('div.oxd-table-card')
            .filter({ hasText: new RegExp(`\\b${prefix}`, 'i') })
            .first(),
    // Label-scoped text input to uniquely target “Employee Name”
    textInputByLabel: (label: string): Locator =>
        page.locator('div.oxd-input-group').filter({ hasText: label }).locator('input').first(),
    rowDeleteButton: (row: Locator): Locator =>
        row.locator('i.oxd-icon.bi-trash').first(),

    firstNameInput: page.getByRole('textbox', { name: 'First Name' }),
    lastNameInput: page.getByRole('textbox', { name: 'Last Name' }),
    saveButton: page.getByRole('button', { name: 'Save' }),

    // New: click the first link within a result row (employee name)
    rowFirstLink: (row: Locator): Locator => row.getByRole('link').first(),
    personalDetailsBreadcrumb: page.getByRole('heading', { name: 'Personal Details' }),

    jobTab: page.getByRole('link', { name: 'Job' }),
    contactDetailsTab: page.getByRole('link', { name: 'Contact Details' }),
    // Enable edit mode on Job tab before interacting
    editButton: page.getByRole('button', { name: 'Edit' }),

    effectiveDateInput: page
      .locator('div.oxd-input-group')
      .filter({ hasText: 'Joined Date' })
      .locator('input')
      .first(),

    // Custom dropdown helpers: find a field group by label, open dropdown, pick option
    fieldGroupByLabel: (label: string): Locator =>
        page.locator('div.oxd-input-group').filter({ hasText: label }).first(),
    dropdownInputByLabel: (label: string): Locator =>
        page.locator('div.oxd-input-group')
            .filter({ hasText: label })
            .locator('.oxd-select-text')
            .first(),
    dropdownList: page.locator('div[role="listbox"]').first(),
    dropdownOptionByText: (optionText: string): Locator =>
      page
        .locator('div[role="listbox"]')
        .locator('.oxd-select-option')
        .filter({ hasText: optionText })
        .first(),

    // Minimal fix: label-scoped inputs
    street1Input: page
      .locator('div.oxd-input-group')
      .filter({ hasText: 'Street 1' })
      .locator('input')
      .first(),

    cityInput: page
      .locator('div.oxd-input-group')
      .filter({ hasText: 'City' })
      .locator('input')
      .first(),
    countrySelect: page.getByLabel('Country'),
    emailInput: page
      .locator('div.oxd-input-group')
      .filter({ hasText: 'Work Email' })
      .locator('input')
      .first(),

    confirmDeleteButton: page.getByRole('button', { name: 'Yes, Delete' }),
    // More robust: target the success toast container
    toastSuccess: page.locator('.oxd-toast.oxd-toast--success').first(),
  };
}