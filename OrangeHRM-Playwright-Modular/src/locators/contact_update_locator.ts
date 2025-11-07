import type { Page, Locator } from '@playwright/test';

export function contactUpdateLocators(page: Page): {
  contactDetailsLink: Locator;
  contactDetailsHeader: Locator;
  workEmailLabel: Locator;
  street1Input: Locator;
  cityInput: Locator;
  workEmailInput: Locator;
  countryCombobox: Locator;
  dropdownList: Locator;
  dropdownOptionByText: (value: string) => Locator;
  saveButton: Locator;
} {
  return {
    contactDetailsLink: page.getByRole('link', { name: 'Contact Details' }),
    contactDetailsHeader: page.getByRole('heading', { name: /contact details/i }),
    workEmailLabel: page.getByText('Work Email'),
    street1Input: page.locator('.oxd-input-group:has-text("Street 1") .oxd-input'),
    cityInput: page.locator('.oxd-input-group:has-text("City") .oxd-input'),
    workEmailInput: page.locator('.oxd-input-group:has-text("Work Email") .oxd-input'),
    countryCombobox: page.locator('.oxd-input-group:has-text("Country") .oxd-select-text'),
    dropdownList: page.locator('.oxd-select-dropdown'),
    dropdownOptionByText: (value: string) =>
      page.locator('.oxd-select-dropdown').getByText(value, { exact: true }),
    saveButton: page.getByRole('button', { name: 'Save' }),
  };
}