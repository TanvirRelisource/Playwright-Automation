import { test } from "@playwright/test";
import { admin } from "../../src/data/users";
import { makeUniqueName } from "../../src/data/employees";
import { loginFlow } from "../../src/flows/auth";
import {
    createEmployeeFlow,
    searchAndOpenFirstEmployeeByPrefix,
    updateJobFlow,
    updateContactFlow,
    deleteFirstEmployeeByPrefixFlow,
} from "../../src/flows/employee";

test.describe.serial("Employee Lifecycle (create → update → delete)", () => {
    test.beforeEach(async ({ page }) => {
        await loginFlow(page, admin);
    });

    test("lifecycle process validation (steps contain scenarios)", async ({
        page,
    }) => {
        await page.context().tracing.start({
            screenshots: true,
            snapshots: true,
        });
        await test.step("Scenario #1: Create Employee (Required Fields)", async () => {
            const name = makeUniqueName("abc");
            await createEmployeeFlow(page, name);

            await test.info().attach("Scenario 1 - Create Employee", {
                body: await page.screenshot({ fullPage: true }),
                contentType: "image/png",
            });
        });

        await test.step("Scenario #2: Update Job Details (Valid)", async () => {
            await searchAndOpenFirstEmployeeByPrefix(page, "abc");
            await updateJobFlow(page, {
                effectiveDate: new Date().toISOString().split("T")[0],
                jobTitle: "Software Engineer",
                jobCategory: "Technicians",
                subUnit: "Engineering",
                employmentStatus: "Full-Time Permanent",
            });

            await test.info().attach("Scenario 2 - Update Job Details", {
                body: await page.screenshot({ fullPage: true }),
                contentType: "image/png",
            });
        });

        await test.step("Scenario #3: Update Contact Details (Valid)", async () => {
            await searchAndOpenFirstEmployeeByPrefix(page, "abc");
            await updateContactFlow(page, {
                street1: "123 Automation Ave",
                city: "Testville",
                country: "United States",
                email: `qa.${Date.now()}@example.com`,
            });

            await test.info().attach("Scenario 3 - Update Contact Details", {
                body: await page.screenshot({ fullPage: true }),
                contentType: "image/png",
            });
        });

        await test.step("Scenario #4: Delete Employee (Confirm)", async () => {
            await deleteFirstEmployeeByPrefixFlow(page, "abc");
            await page.pause();

            await test.info().attach("Scenario 4 - Delete Employee", {
                body: await page.screenshot({ fullPage: true }),
                contentType: "image/png",
            });
        });
        await page.context().tracing.stop({
            path: "./framework/test-results/lifecycle-trace.zip",
        });
    });
});
