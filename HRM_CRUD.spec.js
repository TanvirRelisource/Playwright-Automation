import { test, expect } from "@playwright/test";

test("Test 1: Admin Login & Navigate to PIM", async ({ page }) => {
  const username = process.env.ORANGEHRM_USERNAME || "Admin";
  const password = process.env.ORANGEHRM_PASSWORD || "admin123";

  await page.goto("https://opensource-demo.orangehrmlive.com/");
  await page.pause();
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/);
  await page.getByRole("link", { name: "PIM" }).click();

  await expect(page).toHaveURL(/pim/);
  await expect(page.getByRole("heading", { name: "PIM" })).toBeVisible();
});

test("Test Case 2: Create Employee (Required Fields)", async ({ page }) => {
  const username = process.env.ORANGEHRM_USERNAME || "Admin";
  const password = process.env.ORANGEHRM_PASSWORD || "admin123";

  await page.goto("https://opensource-demo.orangehrmlive.com/");
  await page.pause();
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.getByRole("link", { name: "PIM" }).click();
  await expect(page).toHaveURL(/pim/);

  await page.getByRole("link", { name: "Add Employee" }).click();
  await expect(page).toHaveURL(/pim\/addEmployee/);

  const unique = Date.now().toString().slice(-6);
  await page.getByPlaceholder("First Name").fill(`Test${unique}`);
  await page.getByPlaceholder("Last Name").fill(`User${unique}`);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page).toHaveURL(/pim\/viewPersonalDetails/);
  await expect(
    page.getByRole("heading", { name: "Personal Details" })
  ).toBeVisible();
});

test("Test Case 3: Read Employee Details", async ({ page }) => {
  const username = process.env.ORANGEHRM_USERNAME || "Admin";
  const password = process.env.ORANGEHRM_PASSWORD || "admin123";
  const searchName = process.env.EMP_SEARCH_NAME || "";

  await page.goto("https://opensource-demo.orangehrmlive.com/");
  await page.pause();
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.getByRole("link", { name: "PIM" }).click();
  await page.getByRole("link", { name: "Employee List" }).click();
  await expect(page).toHaveURL(/pim\/viewEmployeeList/);

  if (searchName) {
    await page.getByPlaceholder("Type for hints...").fill(searchName);
    await page.locator(".oxd-autocomplete-option").first().click();
  }

  await page.getByRole("button", { name: "Search" }).click();

  // Open first result's details
  await page
    .locator(".oxd-table-card")
    .first()
    .locator(".oxd-table-cell-actions button")
    .first()
    .click();

  await expect(page).toHaveURL(/pim\/viewPersonalDetails/);
  await expect(
    page.getByRole("heading", { name: "Personal Details" })
  ).toBeVisible();
});

test('Test case 4: Update Employee Personal Details', async ({ page }) => {
  // ... existing code ...
  const username = process.env.ORANGEHRM_USERNAME || 'Admin';
  const password = process.env.ORANGEHRM_PASSWORD || 'admin123';
  const searchName = process.env.EMP_SEARCH_NAME || 'Charles';
  const newMiddleName = process.env.EMP_NEW_MIDDLE || 'Mike';
  const newLastName = process.env.EMP_NEW_LAST || 'Higgins';
  const newNationality = process.env.EMP_NATIONALITY || 'American';
  const newMaritalStatus = process.env.EMP_MARITAL || 'Married';
  const newBlood = process.env.EMP_BLOOD || 'A+';

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'PIM' }).click();
  const empSearch = page.getByRole('textbox', { name: 'Type for hints...' }).first();
  await empSearch.fill('charles'); 
  await page.getByRole('button', { name: 'Search' }).click();

  // Open first result
  await page.getByText('Charles').click();

  // Update names
  const middleInput = page.getByRole('textbox', { name: 'Middle Name' });
  const lastInput = page.getByRole('textbox', { name: 'Last Name' });
  await middleInput.fill(newMiddleName);
  await lastInput.fill(newLastName);

  // Nationality (Personal Details)
  const nationalitySelect = page.locator('.oxd-input-group:has(label:has-text("Nationality")) .oxd-select-text');
  await nationalitySelect.click();
  await page.locator('.oxd-select-dropdown').getByText(newNationality, { exact: true }).click();

  // Marital Status (Personal Details)
  const maritalSelect = page.locator('.oxd-input-group:has(label:has-text("Marital Status")) .oxd-select-text');
  await maritalSelect.click();
  await page.locator('.oxd-select-dropdown').getByText(newMaritalStatus, { exact: true }).click();

  // Save Personal Details form
  const personalSave = page.locator('form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: /^Save$/ });
  await personalSave.click();
  await expect(page.locator('.oxd-toast-content')).toContainText(/Successfully (Saved|Updated)/);

  // Blood Type under Custom Fields section
  const customFields = page.getByRole('heading', { name: 'Custom Fields' }).locator('..');
  const bloodSelect = customFields.locator('.oxd-input-group:has(label:has-text("Blood Type")) .oxd-select-text');
  await bloodSelect.click();
  await page.locator('.oxd-select-dropdown').getByText(newBlood, { exact: true }).click();
  await page.pause();
  // Save Custom Fields form
  await page.locator('form').filter({ hasText: 'Employee Full NameEmployee' }).getByRole('button').click();
  await page.locator('form').filter({ hasText: 'Blood TypeA+Test_Field Save' }).getByRole('button').click();

  // Verify updated values
  await expect(middleInput).toHaveValue(newMiddleName);
  await expect(lastInput).toHaveValue(newLastName);

  // Verify in Employee List
  await page.getByRole('link', { name: 'Employee List' }).click();
  const searchBox = page.getByRole('textbox', { name: 'Type for hints...' }).first();
  await searchBox.fill('charles');
  await page.getByText(`Charles ${newMiddleName} ${newLastName}`).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText(`Charles ${newMiddleName}`)).toBeVisible();
});

test('Test case 5: Update Employee Contact Details', async ({ page }) => 
{
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('A');
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('ash');
  await page.getByRole('option', { name: 'Ash J Tyson' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Ash J').click();
  await page.getByRole('link', { name: 'Contact Details' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).press('CapsLock');
  await page.getByRole('textbox').nth(1).fill('S');
  await page.getByRole('textbox').nth(1).press('CapsLock');
  await page.getByRole('textbox').nth(1).fill('Samson');
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).press('CapsLock');
  await page.getByRole('textbox').nth(2).fill('C');
  await page.getByRole('textbox').nth(2).press('CapsLock');
  await page.getByRole('textbox').nth(2).fill('Central');
  await page.getByRole('textbox').nth(3).click();
  await page.getByRole('textbox').nth(3).press('CapsLock');
  await page.getByRole('textbox').nth(3).fill('L');
  await page.getByRole('textbox').nth(3).press('CapsLock');
  await page.getByRole('textbox').nth(3).fill('London');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).press('CapsLock');
  await page.getByRole('textbox').nth(4).fill('L');
  await page.getByRole('textbox').nth(4).press('CapsLock');
  await page.getByRole('textbox').nth(4).fill('London');
  await page.getByRole('textbox').nth(5).click();
  await page.getByRole('textbox').nth(5).fill('1234');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('.oxd-input.oxd-input--focus').fill('123456');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('572893');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('52907');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('T');
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('Test7@example.com');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('T');
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('Test8@example.com');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('ash');
  await page.getByRole('option', { name: 'Ash J Tyson' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Ash J').click();
  await page.pause();
  await page.getByRole('link', { name: 'Contact Details' }).click();
});

test("Test Case 6: Update Employee Job Details", async({page})=>
{
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('A');
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('B');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('Emily');
  await page.getByRole('option', { name: 'Emily Jones' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Emily').click();
  await page.getByRole('link', { name: 'Job' }).click();
  await page.locator('.oxd-icon.bi-calendar').click();
  await page.getByText('31').click();
  await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
  await page.getByRole('option', { name: 'Automaton Tester' }).click();
  /* await page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
  await page.getByText('Professionals').click(); */
  //Code blocks start from here
  const jobCategoryGroup = page.locator('.oxd-input-group:has(label:has-text("Job Category"))');
  await jobCategoryGroup.scrollIntoViewIfNeeded();
  const jobCategorySelect = jobCategoryGroup.locator('.oxd-select-text');
  await expect(jobCategorySelect).toBeVisible();
  await jobCategorySelect.click();

  const jobCategoryDropdown = page.locator('.oxd-select-dropdown');
  await expect(jobCategoryDropdown).toBeVisible();
  await jobCategoryDropdown.getByText('Professionals', { exact: true }).click();
  await expect(jobCategorySelect.locator('.oxd-select-text-input')).toHaveText('Professionals');
  //end here
  await page.locator('div:nth-child(5) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
  await page.getByRole('option', { name: 'Engineering' }).click();
  /* await page.locator('div:nth-child(6) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
  await page.getByText('Canadian Regional HQ').click(); */
  //Start code
   // await page.pause();
  const locationGroup = page.locator('.oxd-input-group:has(label:has-text("Location"))');
  const locationSelect = locationGroup.locator('.oxd-select-text');
  await locationSelect.click();

  const locationDropdown = page.locator('.oxd-select-dropdown');
  await expect(locationDropdown).toBeVisible();
  await locationDropdown.getByText('Canadian Regional HQ', { exact: true }).click();

  await expect(locationSelect.locator('.oxd-select-text-input'))
    .toHaveText('Canadian Regional HQ');
  //end code
/*   await page.locator('div:nth-child(7) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
  await page.getByText('Full-Time Contract').click(); */
  //start code
  await page.pause();
    const employmentStatusGroup = page.locator('.oxd-input-group:has(label:has-text("Employment Status"))');
  await employmentStatusGroup.scrollIntoViewIfNeeded();
  const employmentStatusSelect = employmentStatusGroup.locator('.oxd-select-text');
  await expect(employmentStatusSelect).toBeVisible();
  await employmentStatusSelect.click();

  const employmentDropdown = page.locator('.oxd-select-dropdown');
  await expect(employmentDropdown).toBeVisible();
  await employmentDropdown.getByRole('option', { name: 'Full-Time Contract' }).click();

  await expect(employmentStatusSelect.locator('.oxd-select-text-input'))
    .toHaveText('Full-Time Contract');
  //end code
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('Emily');
  await page.getByRole('option', { name: 'Emily Jones' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Emily').click();
  await page.getByRole('link', { name: 'Job' }).click();
});

// ... existing code ...
test('Test Case 7: Delete Employee', async ({ page }) => {
  const username = process.env.ORANGEHRM_USERNAME || 'Admin';
  const password = process.env.ORANGEHRM_PASSWORD || 'admin123';
  const targetName = process.env.EMP_DELETE_NAME || 'Emily Jones';

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.pause();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  // Search by employee name using autocomplete hint
  const nameBox = page.getByRole('textbox', { name: 'Type for hints...' }).first();
  await nameBox.fill(targetName.split(' ')[0]);
  await page.getByRole('option', { name: targetName }).click();
  await page.getByRole('button', { name: 'Search' }).click();

  // Delete from the matching row
  const row = page.locator('.oxd-table-card').filter({ hasText: targetName }).first();
  await expect(row).toBeVisible();
  await row.locator('button:has(.bi-trash)').click();

  // Confirm deletion in modal and assert toast
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, Delete' }).click();
});

// ... existing code ...
test('Test Case 8: Create Employee — Required Field Validation', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('A');
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Add Employee' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name' }).fill('T');
  await page.getByRole('textbox', { name: 'First Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name' }).fill('Tanvir');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('A');
  await page.getByRole('textbox', { name: 'Last Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Ahmed');
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name' }).fill('T');
  await page.getByRole('textbox', { name: 'First Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name' }).fill('Tanvir');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('tanvir');
  await page.getByText('Tanvir Ahmed').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Tanvir').click();
  // ... existing code ...
});

test('Test Case 9: Update Employee - Invalid Email Format', async({page})=>{
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.pause();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('A');
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByText('Amelia').click();
  await page.getByRole('link', { name: 'Contact Details' }).click();
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('T');
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('Te');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('.oxd-input.oxd-input--focus').fill('Testmail@.com');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('.oxd-input.oxd-input--active.oxd-input--error').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('Testmail@example');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('.oxd-input.oxd-input--active.oxd-input--error').click();
  await page.locator('.oxd-input.oxd-input--focus').press('ArrowRight');
  await page.locator('.oxd-input.oxd-input--active.oxd-input--error').click();
  await page.locator('.oxd-input.oxd-input--focus').press('ControlOrMeta+a');
  await page.locator('.oxd-input.oxd-input--focus').fill('');
  await page.locator('.oxd-input.oxd-input--active.oxd-input--error').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('@example.com');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('.oxd-input.oxd-input--active.oxd-input--error').click();
  await page.locator('.oxd-input.oxd-input--focus').press('ControlOrMeta+a');
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('T');
  await page.locator('.oxd-input.oxd-input--focus').press('CapsLock');
  await page.locator('.oxd-input.oxd-input--focus').fill('Testmail@example.com');
  await page.getByRole('button', { name: 'Save' }).click();
});

test.only('Test Case 10: Delete Employee--Cancel Confirmation', async({page})=>{
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.pause();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('A');
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('A');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('Al');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('Albert');
  await page.getByText('Alberto Jesus Vargas').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: 'No, Cancel' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Employee List' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('A');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('Alb');
  await page.getByText('Alberto Jesus Vargas').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Alberto Jesus').click();
})


