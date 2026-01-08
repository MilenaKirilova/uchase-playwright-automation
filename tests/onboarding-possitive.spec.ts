import { test } from '@playwright/test';
import { OnboardingPage } from '../src/pages/OnboardingPage';
import { DashboardPage } from '../src/pages/DashboardPage';


test.describe('Onboarding – positive flow', () =>{
    test('should complete onboarding and show lessons only for the selected grade on the dashboard',async ({page}) => {
        const onboarding = new OnboardingPage(page);
        let dashboard: DashboardPage;
        let selectedGrade: string = "0";

        const isOnboardingAvailable = await onboarding.open();

        if(!isOnboardingAvailable) {
            test.skip(true, `Onboarding is already completed and cannot be re-run(redirected to ${page.url()})`);
        }

        await test.step('Select student role', async () => {
            await onboarding.selectStudentAndContinue();
        });

        await test.step('Select grade', async () => {
            selectedGrade = await onboarding.selectFirstVisibleNonActiveGrade();
        });
        page.pause();
        await test.step('Finish onboarding', async () => {
            dashboard = await onboarding.finishOnboarding();
        });
        
        await test.step('Validate dashboard content for selected grade', async () => {
            await dashboard.assertLoaded();
            await dashboard.assertGradeShownInFirstTwoCards(selectedGrade);
        });
    })
})