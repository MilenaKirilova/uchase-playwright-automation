import { test, expect } from '@playwright/test';
import type { Request } from '@playwright/test';
import { OnboardingPage } from '../src/pages/OnboardingPage';

test.describe('Onboarding – negative scenarios', async() => {
    test.use({ storageState: undefined });

    test('Onboarding: should NOT redirect to /dashboard when profile API fails', async ({ page }) => {
        await page.route('**/api/v1/user/profile-information', route => route.abort('failed'));

        const onboarding = new OnboardingPage(page);
        const isAvailable = await onboarding.open();
        test.skip(!isAvailable, 'Onboarding already completed (route guard redirect)');

        await onboarding.selectStudentAndContinue();
        await onboarding.selectFirstVisibleNonActiveGrade();

        const failedReqPromise = page.waitForEvent('requestfailed', {
            predicate: (req: Request) => req.url().includes('/api/v1/user/profile-information'),
            timeout: 10_000,
        });

        await onboarding.submitOnboarding();

        const failedReq = await failedReqPromise;
        const failure = failedReq.failure();

        expect(failure).not.toBeNull();
        expect(failure!.errorText).toBeTruthy();

        await expect(page).not.toHaveURL(/\/dashboard/);
        await expect(page).toHaveURL(/\/onboarding-process/);
    });
})
