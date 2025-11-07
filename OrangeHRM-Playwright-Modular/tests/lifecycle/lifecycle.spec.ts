// top-level imports in this file
import { test, expect } from '@playwright/test';
import loginData from '../../Data/login.json';
import { loginLocators } from '../../src/locators/login_locator';
import { lifecycleLocators } from '../../src/locators/lifecycle_locator';
import { jobUpdateLocators } from '../../src/locators/job_update_locator';
import { contactUpdateLocators } from '../../src/locators/contact_update_locator';
import { deleteEmployeeLocators } from '../../src/locators/delete_employee_locator';
import jobDetails from '../../Data/jobDetails.json';
import contactDetails from '../../Data/contactDetails.json';
import createEmployeeData from '../../Data/createEmployee.json';
import { loginWithCredentials } from '../../src/functions/login';
import { openAddEmployee, fillRequiredEmployeeFieldsAndSave } from '../../src/functions/createEmployee';
import { updateJobDetailsFromBase } from '../../src/functions/jobUpdate';
import { updateContactDetails } from '../../src/functions/contactUpdate';
import { searchEmployeeByName, confirmDelete } from '../../src/functions/deleteEmployee';
const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Employee Lifecycle (create → update → delete)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(LOGIN_URL);

        const loc = loginLocators(page);
        await expect(loc.usernameInput).toBeVisible();
        await expect(loc.passwordInput).toBeVisible();
        await expect(loc.loginButton).toBeVisible();

        await loginWithCredentials(page, {
            username: loginData.validUsername,
            password: loginData.validPassword,
        });

        await expect(loc.dashboardLink).toBeVisible();
        await expect(loc.employeeDistributionByLocationWidget).toBeVisible();
        await expect(loc.dashboardHeading).toBeVisible();
    });
    test('lifecycle process validation (steps contain scenarios)', async ({ page }) => {
        const life = lifecycleLocators(page);
        const job = jobUpdateLocators(page);
        const contact = contactUpdateLocators(page);
        const del = deleteEmployeeLocators(page);
        await test.step("Scenario #1: Create Employee (Required Fields)", async () => {
            // PIM navigation
            await life.pimMenuLink.click();
            await life.addEmployeeLink.click();
            await expect(life.addEmployeeHeading).toBeVisible();
            await expect(life.saveButton).toBeVisible();

            // Replace direct clicks with function call
            await openAddEmployee(page);

            // Replace fills and save with function call
            await fillRequiredEmployeeFieldsAndSave(page, {
                firstName: createEmployeeData.firstName,
                lastName: createEmployeeData.lastName,
                uniqueId: createEmployeeData.uniqueId,
            });

            await life.saveButton.click();
            await expect(life.personalDetailsHeader).toBeVisible();
            await expect(life.contactDetailsLink).toBeVisible();

            // Save and post-save signal
            await test.info().attach('Scenario 1 - Create Employee', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });

        await test.step('Scenario #2: Update job details', async () => {
            await job.jobDetailsLink.click();
            await expect(job.jobDetailsHeader).toBeVisible();
            await expect(job.saveButton).toBeVisible();
            await expect(job.attachmentsHeading).toBeVisible();
            await updateJobDetailsFromBase(page, jobDetails);
            await expect(job.jobDetailsHeader).toBeVisible();
            await expect(job.saveButton).toBeVisible();

            await test.info().attach('Scenario 2 - Update Employee', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });

        await test.step('Scenario #3: Update employee Contact Details', async () => {
            await contact.contactDetailsLink.click();
            await expect(contact.contactDetailsHeader).toBeVisible();
            await expect(contact.workEmailLabel).toBeVisible();

            await updateContactDetails(
                contact,
                contactDetails.street1,
                contactDetails.city,
                contactDetails.workEmail,
                contactDetails.country
            );

            await expect(contact.contactDetailsHeader).toBeVisible();
            await expect(contact.saveButton).toBeVisible();

            await test.info().attach('Scenario 3 - Update Employee', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });

        await test.step('Scenario #4: Delete employee', async () => {
            await page.getByRole('link', { name: 'Employee List' }).click();
            await expect(del.employeeListLink).toBeVisible();
            await page.getByRole('textbox').nth(2).fill(createEmployeeData.uniqueId);
            await page.getByRole('button', { name: 'Search' }).click();
            await expect(del.recordFoundText).toBeVisible();
            await expect(del.gridText(`${createEmployeeData.firstName}`)).toBeVisible();
            await expect(del.deleteButton).toBeVisible();
            await del.deleteButton.click();
            await del.confirmDeleteButton.click();

            await expect(del.firstNameColumnHeader).toBeVisible();
            await expect(del.actionsColumnHeader).toBeVisible();

            await test.info().attach('Scenario 4 - Delete Employee', {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        });
    });
});
