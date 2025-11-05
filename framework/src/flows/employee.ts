import { Page, expect } from '@playwright/test';
import { PIMPage } from '../pages/PIMPage';
import { pimLocators } from '../locators/pim';
import { EmployeeName, displayName, JobUpdate, ContactUpdate } from '../data/employees';

export async function createEmployeeFlow(page: Page, name: EmployeeName) {
    const pim = new PIMPage(page);
    const loc = pimLocators(page);

    await pim.openPIM();
    await pim.openAddEmployee();

    await loc.firstNameInput.fill(name.firstName);
    await loc.lastNameInput.fill(name.lastName);
    await loc.saveButton.click();

    await expect(page).toHaveURL(/\/pim\/viewPersonalDetails/i);
    await expect(pimLocators(page).personalDetailsBreadcrumb).toBeVisible();
}

export async function searchEmployeeFlow(page: Page, fullName: string) {
      const pim = new PIMPage(page);
  const loc = pimLocators(page);

  await page.pause();
  await pim.openPIM();
  await pim.openEmployeeList();

  await loc.employeeNameInput.fill(fullName);

  // Try typeahead suggestion; fallback to raw search if not visible quickly
  const suggestion = page.getByText(fullName, { exact: true }).first();
  try {
    await suggestion.waitFor({ state: 'visible', timeout: 1000 });
    await suggestion.click();
  } catch {
    // Fallback: proceed without suggestion selection
  }

  await loc.searchButton.click();

  // Prefer row match by name for robustness
  await expect(loc.rowByName(fullName)).toBeVisible();
}

export async function openEmployeeFromResults(page: Page) {
  const loc = pimLocators(page);
  await loc.firstResultCard.click();
  await expect(page).toHaveURL(/\/pim\/viewPersonalDetails/i);
  await expect(pimLocators(page).personalDetailsBreadcrumb).toBeVisible();
}

export async function updateJobFlow(page: Page, update: JobUpdate) {
  const loc = pimLocators(page);

  await loc.jobTab.click();
  await expect(loc.dropdownInputByLabel('Job Title')).toBeVisible();

  // Enter edit mode if the Job form is read-only
  if (await loc.editButton.isVisible()) {
    await loc.editButton.click();
  }

  if (update.effectiveDate) {
    await loc.effectiveDateInput.fill(update.effectiveDate);
  }
  if (update.jobTitle) {
    // Click the whole field group to open the dropdown
    await loc.fieldGroupByLabel('Job Title').click();
    await expect(loc.dropdownList).toBeVisible();
    await loc.dropdownOptionByText(update.jobTitle).click();
  }
  if (update.jobCategory) {
    await loc.dropdownInputByLabel('Job Category').click();
    await expect(loc.dropdownList).toBeVisible();
    await page.getByText(update.jobCategory, { exact: true }).click();
  } 
  if (update.subUnit) {
    await loc.fieldGroupByLabel('Sub Unit').click();
    await expect(loc.dropdownList).toBeVisible();
    await loc.dropdownOptionByText(update.subUnit).click();
  }
  if (update.employmentStatus) {
    await loc.fieldGroupByLabel('Employment Status').click();
    await expect(loc.dropdownList).toBeVisible();
    await loc.dropdownOptionByText(update.employmentStatus).click();
  }

  await loc.saveButton.click();
}

export async function updateContactFlow(page: Page, update: ContactUpdate) {
  const loc = pimLocators(page);

  await loc.contactDetailsTab.click();

  // Enable edit mode if the form is read-only
  const editBtn = page.getByRole('button', { name: 'Edit' });
  if (await editBtn.isVisible()) {
    await editBtn.click();
  }

  if (update.street1) {
    await loc.street1Input.fill(update.street1);
  }
  if (update.city) {
    await loc.cityInput.fill(update.city);
  }
  if (update.country) {
    await loc.dropdownInputByLabel('Country').click();
    await page
      .locator('.oxd-select-dropdown .oxd-select-option')
      .filter({ hasText: update.country })
      .first()
      .click();
  }
  if (update.email) {
    await loc.emailInput.fill(update.email);
  }

  await loc.saveButton.click();
}

export async function deleteEmployeeFlow(page: Page, fullName: string) {
  const pim = new PIMPage(page);
  const loc = pimLocators(page);

  await pim.openPIM();
  await pim.openEmployeeList();

  await loc.employeeNameInput.fill(fullName);
  const suggestion = page.getByText(fullName, { exact: true }).first();
  await suggestion.waitFor({ state: 'visible' });
  await suggestion.click();
  await loc.searchButton.click();

  const row = loc.rowByName(fullName);
  await expect(row).toBeVisible();

  const deleteBtn = loc.rowDeleteButton(row);
  await deleteBtn.click();

  await expect(loc.confirmDeleteButton).toBeVisible();
  await loc.confirmDeleteButton.click();
  await expect(loc.toastSuccess).toHaveCount(1);
}

export async function searchAndOpenFirstEmployeeByPrefix(page: Page, prefix: string) {
    const pim = new PIMPage(page);
    const loc = pimLocators(page);

    await pim.openPIM();
    await pim.openEmployeeList();

    await loc.employeeNameInput.fill(prefix);
    await loc.searchButton.click();

    // Click the first result row directly (no inner link)
    await expect(loc.firstResultCard).toBeVisible();
    await loc.firstResultCard.click();

    await expect(pimLocators(page).personalDetailsBreadcrumb).toBeVisible();
}

export async function deleteFirstEmployeeByPrefixFlow(page: Page, prefix: string) {
    const pim = new PIMPage(page);
    const loc = pimLocators(page);

    await pim.openPIM();
    await pim.openEmployeeList();

    await loc.employeeNameInput.fill(prefix);
    await loc.searchButton.click();

    await expect(loc.firstResultCard).toBeVisible();

    const deleteBtn = loc.rowDeleteButton(loc.firstResultCard);
    await deleteBtn.click();

    await expect(loc.confirmDeleteButton).toBeVisible();
    await loc.confirmDeleteButton.click();

}
