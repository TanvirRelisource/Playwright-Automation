import { test, expect } from '@playwright/test';

test ('Shoping cart test', async ({ page }) => {
  await page.goto('http://opencart.abstracta.us/');
  await page.pause();
  await page.getByText('MacBook').click();
  await page.getByRole('textbox', { name: 'Qty' }).click();
  await page.getByRole('textbox', { name: 'Qty' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Qty' }).fill('2');
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'Phones & PDAs' }).click();
  await page.getByText('iPhone', { exact: true }).click();
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await page.getByRole('link', { name: 'Cameras' }).click();
  await page.getByText('Canon EOS 5D').click();
  await page.getByLabel('Select').selectOption('16');
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: ' 4 item(s) - $' }).click();
  await page.getByRole('link', { name: ' View Cart' }).click();
  await page.getByRole('link', { name: 'Checkout', exact: true }).click();
})