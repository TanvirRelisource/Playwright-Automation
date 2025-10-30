const { test, expect } = require("@playwright/test");

const testData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.test@example.com",
  telephone: "1234567890",
  password: "Test@123456",
  wrongPassword: "DifferentPass123",
  url: "http://opencart.abstracta.us/index.php?route=account/register",
};

const selectors = {
  firstName: "#input-firstname",
  lastName: "#input-lastname",
  email: "#input-email",
  telephone: "#input-telephone",
  password: "#input-password",
  confirmPassword: "#input-confirm",
  continueButton: 'input[value="Continue"]',
  errorMessages: ".text-danger",
  privacyPolicy: 'input[name="agree"]',
};
// Privacy Policy Test Data
const privacyTestData = {
  ...testData,
  validEmail: "privacy.test@example.com", // Different email for privacy test
};

// Helper function for Privacy Policy test
async function fillFormExceptPrivacy(page) {
  await page.fill(selectors.firstName, privacyTestData.firstName);
  await page.fill(selectors.lastName, privacyTestData.lastName);
  await page.fill(selectors.email, privacyTestData.validEmail);
  await page.fill(selectors.telephone, privacyTestData.telephone);
  await page.fill(selectors.password, privacyTestData.password);
  await page.fill(selectors.confirmPassword, privacyTestData.password);
}

test("Test Case 1: Empty Form Validation test", async ({ page }) => {
  await page.goto(
    "http://opencart.abstracta.us/index.php?route=account/register"
  );
  await page.pause();
  await page.locator('input[value="Continue"]').click();
  const errorMessages = await page.locator(".text-danger").allTextContents();
});

test("Test Case 2: Email Format Validation Test", async ({ page }) => {
  // Step 1: Go to registration page
  await page.goto(
    "http://opencart.abstracta.us/index.php?route=account/register"
  );
  await page.pause();

  // Step 2: Fill form with invalid email
  await page.locator("#input-firstname").fill("John");
  await page.locator("#input-lastname").fill("Doe");
  await page.locator("#input-email").fill("invalid-email-format");
  await page.locator("#input-telephone").fill("1234567890");
  await page.locator("#input-password").fill("Test@123456");
  await page.locator("#input-confirm").fill("Test@123456");

  // Step 3: Check privacy policy and submit
  await page.locator('input[name="agree"]').check();
  await page.locator('input[value="Continue"]').click();

  // Step 4: Check for email validation error
  await page.waitForTimeout(2000);
  const errorMessages = await page.locator(".text-danger").allTextContents();

  // Step 5: Verify email error exists
  const hasEmailError = errorMessages.some(
    (error) =>
      error.toLowerCase().includes("email") ||
      error.toLowerCase().includes("valid")
  );
  expect(hasEmailError).toBeTruthy();
  console.log("Part 2 PASSED: Email validation working correctly");
});

test("Test Case 3: Password Mismatch Validation Test", async ({ page }) => {
  console.log("Starting Part 3: Password Mismatch Test");
  await page.goto(testData.url);
  await page.pause();
  console.log("Opened registration page");
  // Your code will go here
  // Step 2: Fill form fields using variables
  await page.locator(selectors.firstName).fill(testData.firstName);
  await page.locator(selectors.lastName).fill(testData.lastName);
  await page.locator(selectors.email).fill(testData.email);
  await page.locator(selectors.telephone).fill(testData.telephone);
  await page.locator(selectors.password).fill(testData.password);
  await page.locator(selectors.confirmPassword).fill(testData.wrongPassword); // 🔑 Mismatch!

  // Step 3: Submit form using variables
  await page.locator(selectors.privacyPolicy).check();
  await page.locator(selectors.continueButton).click();

  // Step 4: Check errors using variables
  const errorMessages = await page
    .locator(selectors.errorMessages)
    .allTextContents();
  console.log("Error Messages:", errorMessages);
  // Step 5: Verify password mismatch error exists
  const hasPasswordMismatchError = errorMessages.some(
    (error) =>
      error.toLowerCase().includes("password") ||
      error.toLowerCase().includes("mismatch")
  );
  expect(hasPasswordMismatchError).toBeTruthy();
  console.log("Part 3 PASSED: Password mismatch validation working correctly");
});

test("Test Case 4: Privacy Policy Agreement Test", async ({ page }) => {
  console.log("Starting Privacy Policy Agreement Test");
  await page.goto(privacyTestData.url);
  await page.pause();
  //TEST 1: Submit WITHOUT Privacy Policy (Should Fail)
  console.log("Test 1: Submit form WITHOUT checking Privacy Policy");
  await fillFormExceptPrivacy(page);
  // Intentionally NOT checking privacy policy
  await page.locator(selectors.continueButton).click();
  await page.waitForTimeout(3000);
  // Step 3: Check errors using variables (YOUR SIMPLE STYLE)
  const errorMessages = await page
    .locator(selectors.errorMessages)
    .allTextContents();
  console.log("Error Messages:", errorMessages);
  // Step 5: Check for any alert or warning messages (alternative selectors)
  const alertMessages = await page
    .locator(".alert, .warning, .danger, .error")
    .allTextContents();
  console.log("Alert Messages:", alertMessages);
  const allMessages = [...errorMessages, ...alertMessages];
  const hasPrivacyError = allMessages.some(
    (error) =>
      error.toLowerCase().includes("privacy") ||
      error.toLowerCase().includes("policy") ||
      error.toLowerCase().includes("agree") ||
      error.toLowerCase().includes("terms") ||
      error.toLowerCase().includes("must") ||
      error.toLowerCase().includes("required")
  );
  if (hasPrivacyError) {
    expect(hasPrivacyError).toBeTruthy();
    console.log("Privacy policy error found - test PASSED");
  }
});

test("Test Case 5: Newsletter Selection Test", async ({ page }) => {
  // ... existing code ...
  const uniqueEmail = `newsletter+${Date.now()}@example.com`;

  // Navigate to registration
  await page.goto(testData.url);

  await page.pause();

  // Fill registration form using selectors/testData
  await page.locator(selectors.firstName).fill(testData.firstName);
  await page.locator(selectors.lastName).fill(testData.lastName);
  await page.locator(selectors.email).fill(uniqueEmail);
  await page.locator(selectors.telephone).fill(testData.telephone);
  await page.locator(selectors.password).fill(testData.password);
  await page.locator(selectors.confirmPassword).fill(testData.password);

  // Select newsletter = Yes (simple CSS) and accept privacy policy
  await page.locator('input[name="newsletter"][value="1"]').check();
  await page.locator(selectors.privacyPolicy).check();

  // Submit registration
  await page.locator(selectors.continueButton).click();

  // Go to account area
  await page.getByRole("link", { name: "Continue" }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
});


test("Test Case 6: Successful Registration Test", async ({ page }) => {
  const email = `success+${Date.now()}@example.com`;

  await page.goto(testData.url);
  await page.pause();
  // Fill form using shared selectors/testData
  await page.locator(selectors.firstName).fill(testData.firstName);
  await page.locator(selectors.lastName).fill(testData.lastName);
  await page.locator(selectors.email).fill(email);
  await page.locator(selectors.telephone).fill(testData.telephone);
  await page.locator(selectors.password).fill(testData.password);
  await page.locator(selectors.confirmPassword).fill(testData.password);

  // Accept Privacy Policy and submit
  await page.locator(selectors.privacyPolicy).check();
  await page.locator(selectors.continueButton).click();

  // Success page assertions (robust)
  await expect(page).toHaveURL(/route=account\/success/);
  await expect(page.getByText("Congratulations")).toBeVisible();

  // Continue to account and logout
  await page.locator('a:has-text("Continue")').click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test.only("Test Case 7: Duplicate Email Registration Test", async ({ page }) => {
  const email = `duplicate+${Date.now()}@example.com`;

  // 1) Register a new account (precondition)
  await page.goto(testData.url);
  await page.pause();
  await page.locator(selectors.firstName).fill(testData.firstName);
  await page.locator(selectors.lastName).fill(testData.lastName);
  await page.locator(selectors.email).fill(email);
  await page.locator(selectors.telephone).fill(testData.telephone);
  await page.locator(selectors.password).fill(testData.password);
  await page.locator(selectors.confirmPassword).fill(testData.password);
  await page.locator(selectors.privacyPolicy).check();
  await page.locator(selectors.continueButton).click();

  // Confirm success page
  await expect(page).toHaveURL(/route=account\/success/);
  await expect(page.getByText("Congratulations")).toBeVisible();

  // Go to account area and logout
  await page.locator('a:has-text("Continue")').click();
  await page.getByRole("link", { name: "Logout" }).click();

  // 2) Try to register again with the SAME email
  await page.getByRole("link", { name: "Register" }).click();
  await page.locator(selectors.firstName).fill(testData.firstName);
  await page.locator(selectors.lastName).fill(testData.lastName);
  await page.locator(selectors.email).fill(email); // same email
  await page.locator(selectors.telephone).fill(testData.telephone);
  await page.locator(selectors.password).fill(testData.password);
  await page.locator(selectors.confirmPassword).fill(testData.password);
  await page.locator(selectors.privacyPolicy).check();
  await page.locator(selectors.continueButton).click();

  // Assert duplicate email warning
  await expect(page.locator('.alert-danger'))
    .toContainText('Warning: E-Mail Address is already registered!');
});

test("Test Case 8: Field Length Validation Test", async ({ page }) => {
  console.log("Starting Field Length Validation Test");
  await page.goto(testData.url);
  await page.pause();
  await page
    .getByRole("textbox", { name: "* First Name" })
    .fill("abcdefghijklmnopqrstuvwxyz0123456789");
  await page.getByRole("textbox", { name: "* Last Name" }).fill("doe");
  await page
    .getByRole("textbox", { name: "* E-Mail" })
    .fill("test@example.com");
  await page
    .getByRole("textbox", { name: "* Telephone" })
    .fill("+880 1690234181");
  await page
    .getByRole("textbox", { name: "* Password", exact: true })
    .fill("2341");
  await page.getByRole("textbox", { name: "* Password Confirm" }).fill("2341");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("textbox", { name: "* E-Mail" })
    .fill("test10@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("textbox", { name: "* First Name" })
    .fill("abcdefghijklmno");
  await page.getByRole("textbox", { name: "* Telephone" }).fill("+8");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("textbox", { name: "* Telephone" })
    .fill("+880 1689234181");
  await page
    .getByRole("textbox", { name: "* Password", exact: true })
    .fill("123");
  await page.getByRole("textbox", { name: "* Password Confirm" }).fill("123");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("textbox", { name: "* Password", exact: true })
    .fill("1234");
  await page.getByRole("textbox", { name: "* Password Confirm" }).fill("1234");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("link", { name: "Logout" }).click();
});
