import type { Page, Locator } from '@playwright/test';

// import removed to avoid conflict with local declaration

type ContactLocators = ReturnType<typeof contactUpdateLocators>;

export function contactUpdateLocators(page: Page): {
  contactDetailsLink: Locator;
  contactDetailsHeader: Locator;
  workEmailInput: Locator;
  street1Input: Locator;
  cityInput: Locator;
  countryCombobox: Locator;
  dropdownList: Locator;
  dropdownOptionByText: (value: string) => Locator;
  saveButton: Locator;
} {
  return {
    contactDetailsLink: page.getByRole('link', { name: 'Contact Details' }),
    contactDetailsHeader: page.getByRole('heading', { name: /contact details/i }),
    workEmailInput: page.getByRole('textbox', { name: 'Work Email' }),
    street1Input: page.getByRole('textbox', { name: 'Street 1' }),
    cityInput: page.getByRole('textbox', { name: 'City' }),
    countryCombobox: page.getByRole('combobox', { name: 'Country' }),
    dropdownList: page.locator('.oxd-select-dropdown'),
    dropdownOptionByText: (value: string) =>
      page.locator('.oxd-select-dropdown').getByText(value, { exact: true }),
    saveButton: page.getByRole('button', { name: 'Save' }),
  };
}

export async function updateContactDetails(
  contact: ContactLocators,
  street1: string,
  city: string,
  workEmail: string,
  country: string
): Promise<void> {
  await contact.street1Input.fill(street1);
  await contact.cityInput.fill(city);
  await contact.workEmailInput.fill(workEmail);

  await contact.countryCombobox.click();
  await contact.dropdownOptionByText(country).click();

  await contact.saveButton.click();
}