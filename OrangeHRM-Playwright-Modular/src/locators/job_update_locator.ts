import type { Page, Locator } from '@playwright/test';

export function jobUpdateLocators(page: Page): {
  jobDetailsLink: Locator;
  jobDetailsHeader: Locator;
  attachmentsHeading: Locator;
  saveButton: Locator;
  joinedDateInput: Locator;
  jobTitleDropdownArrow: Locator;
  dropdownList: Locator;
  dropdownOptionByText: (value: string) => Locator;
} {
  return {
    jobDetailsLink: page.getByRole('link', { name: 'Job' }),
    jobDetailsHeader: page.getByRole('heading', { name: /job details/i }),
    attachmentsHeading: page.getByRole('heading', { name: 'Attachments' }),
    saveButton: page.getByRole('button', { name: 'Save' }),
    joinedDateInput: page.getByRole('textbox', { name: /yyyy-dd-mm/i }),
    jobTitleDropdownArrow: page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first(),
    dropdownList: page.locator('.oxd-select-dropdown'),
    dropdownOptionByText: (value: string) =>
      page.locator('.oxd-select-dropdown').getByText(value, { exact: true }),
  };
}