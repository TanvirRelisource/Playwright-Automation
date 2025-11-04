import { test } from '@playwright/test';
import { admin } from '../../src/data/users';
import { makeUniqueName, displayName } from '../../src/data/employees';
import { loginFlow } from '../../src/flows/auth';
import {
    createEmployeeFlow,
    searchAndOpenFirstEmployeeByPrefix,
    updateJobFlow,
    updateContactFlow,
    deleteFirstEmployeeByPrefixFlow,
} from '../../src/flows/employee';

test.describe.serial('Employee Lifecycle (create → update → delete)', () => {
    test.beforeEach(async ({ page }) => {
        await loginFlow(page, admin);
    });

    test('create employee and persist runtime data', async ({ page }) => {
        const name = makeUniqueName('abc');
        const fullName = displayName(name);
        await createEmployeeFlow(page, name);
        //await page.pause();
    });

    // Update job details by opening the first “abc” employee found
    test('update job details for saved employee', async ({ page }) => {
        await searchAndOpenFirstEmployeeByPrefix(page, 'abc');
        await updateJobFlow(page, {
            effectiveDate: new Date().toISOString().split('T')[0],
            jobTitle: 'Software Engineer',
            jobCategory: 'Technicians',
            subUnit: 'Engineering',
            employmentStatus: 'Full-Time Permanent',
        });
    });

    // Update contact details for first “abc” employee
    test.only('update contact details for saved employee', async ({ page }) => {
        await searchAndOpenFirstEmployeeByPrefix(page, 'abc');
        await page.pause();
        await updateContactFlow(page, {
            street1: '123 Automation Ave',
            city: 'Testville',
            country: 'United States',
            email: `qa.${Date.now()}@example.com`,
        });
    });

    // Delete first “abc” employee without reading filesystem
    test('delete saved employee', async ({ page }) => {
        await deleteFirstEmployeeByPrefixFlow(page, 'abc');
    });
});