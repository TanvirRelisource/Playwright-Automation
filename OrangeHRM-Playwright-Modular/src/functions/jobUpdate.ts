import type { Page } from '@playwright/test';
import { jobUpdateLocators } from '../locators/job_update_locator';
// ... existing code ...

export interface JobUpdateData {
  joinedDate: string;
  jobTitle: string;
  jobCategory?: string;
  subUnit?: string;
  employmentStatus?: string;
}

// ... existing code ...

export async function updateJobDetails(
  job: ReturnType<typeof jobUpdateLocators>,
  jobDetails: JobUpdateData
): Promise<void> {
  await job.joinedDateInput.fill(jobDetails.joinedDate);
  await job.jobTitleDropdownArrow.click();
  await job.dropdownOptionByText(jobDetails.jobTitle).click();
  await job.saveButton.click();
}

// ... existing code ...

export async function updateJobDetailsFromBase(
  page: Page,
  jobDetails: JobUpdateData
): Promise<void> {
  const job = jobUpdateLocators(page);
  await updateJobDetails(job, jobDetails);
}

// ... existing code ...