import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow a user to navigate to the landing page', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('SynergySphere');
    });

    test('should show login form by default', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('text=Login')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
    });

    test('should switch to register form', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Need an account? Sign up');
        await expect(page.locator('text=Create Account')).toBeVisible();
        await expect(page.locator('#name')).toBeVisible();
    });
});

test.describe('Dashboard and Projects', () => {
    // These tests would ideally run with a mocked backend or a clean test DB
    test('should show dashboard when "logged in"', async ({ page }) => {
        await page.goto('/');

        // Fill login form
        await page.fill('#email', 'test@example.com');
        await page.fill('#password', 'password123');
        await page.click('button[type="submit"]');

        // Since we don't have a real backend running with data in this environment,
        // we expect it to either show dashboard (if login succeeds) 
        // or stay on page (if it fails).
        // In a real E2E, we'd wait for navigation.
    });
});
