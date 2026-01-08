import { test, expect, chromium } from '@playwright/test';
import { OnboardingPage } from '../src/pages/OnboardingPage';
import { DashboardPage } from '../src/pages/DashboardPage';

test.describe('Route guards and access control', () => {
    test('should not load /dashboard if onboarding is not passed', async ({page}) => {
        const onboarding = new OnboardingPage(page);
        const dashboard = new DashboardPage(page);

        const isOnboardingAvailable = await onboarding.open();

        test.skip(!isOnboardingAvailable, 'Onboarding already completed');

        await dashboard.open();
        await expect(page).not.toHaveURL(/\/dashboard/);
    })

    test('should redirect user from onboarding when onboarding is already completed', async ({page}) => {
        const onboarding = new OnboardingPage(page);
        const isOnboardingAvailable = await onboarding.open();

        test.skip(isOnboardingAvailable, 'Onboarding is not completed yet');

        await expect(page).not.toHaveURL(/\/onboarding-process/);
    })
})