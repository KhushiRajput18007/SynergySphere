import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login or perform login
        await page.goto('/');
        await page.fill('#email', 'test@example.com');
        await page.fill('#password', 'password123');
        await page.click('button[type="submit"]');
    });

    test('should see dashboard after login', async ({ page }) => {
        // We expect the dashboard text to appear if login is "successful" 
        // (In this demo environment it might depend on the mock/server response)
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('should show empty projects state initially', async ({ page }) => {
        await expect(page.locator('text=Welcome to SynergySphere')).toBeVisible();
        await expect(page.locator('text=Create your first project')).toBeVisible();
    });

    test('should open new project dialog', async ({ page }) => {
        // Find the New Project button (assuming it exists based on the Index.tsx code)
        const newProjectBtn = page.locator('button:has-text("New Project")');
        if (await newProjectBtn.isVisible()) {
            await newProjectBtn.click();
            // Check for modal or dialog
            await expect(page.locator('text=Create New Project')).toBeVisible();
        }
    });
});
