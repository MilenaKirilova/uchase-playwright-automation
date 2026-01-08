import { Page, Locator, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

export class OnboardingPage {
  readonly page: Page;

  readonly studentRoleCard: Locator;
  readonly rolePickerContinueButton: Locator;
 
  readonly gradeCards: Locator;
  readonly activeGradeNumber: Locator;
  readonly gradePickerContinueButton: Locator;

  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.studentRoleCard = this.page.locator('[data-title="student"]');
    this.rolePickerContinueButton = this.page.locator('button[data-title="role-picker-continue-btn"]');
    this.gradeCards = this.page.locator('.grade-card');
    this.activeGradeNumber = this.page.locator('.grade-card--active .grade-card__number');
    this.gradePickerContinueButton = this.page.locator('button[data-title="grade-picker-continue-btn"]');
    this.acceptCookiesButton = this.page.locator('button[data-title="accept-cookies"]');
  }

  async open(): Promise<boolean> {
    await this.page.goto('/onboarding-process', { waitUntil: 'domcontentloaded' });

    const onboardingUiReady = this.studentRoleCard
      .waitFor({ state: 'visible', timeout: 7000 })
      .then(() => 'onboarding' as const)
      .catch(() => null);

    const redirectedToDashboard = this.page
      .waitForURL('**/dashboard', { timeout: 7000 })
      .then(() => 'dashboard' as const)
      .catch(() => null);

    const result = await Promise.race([onboardingUiReady, redirectedToDashboard]);

    if (result === 'dashboard') {
      return false; 
    }

    if (result === 'onboarding') {
      await this.acceptCookiesIfPresent();
      return true; 
    }

    return this.page.url().includes('/onboarding-process');
  }

async acceptCookiesIfPresent() {
    const banner = this.page.locator('.cookie-wrap');
    const accept = this.page.locator('button[data-title="accept-cookies"]');

    const visible = await banner
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (!visible) return;

    await expect(accept).toBeVisible();
    await accept.click();

    await expect(banner).toBeHidden({ timeout: 5000 });
  }


  async selectStudentAndContinue() {
    await expect(this.studentRoleCard).toBeVisible();
    await this.studentRoleCard.click();

    await expect(this.rolePickerContinueButton).toBeVisible();
    await expect(this.rolePickerContinueButton).toBeEnabled();

    await this.rolePickerContinueButton.click();
  }

  async selectFirstVisibleNonActiveGrade(): Promise<string> {
  const nextNumber = this.page.locator('.swiper-slide-next .grade-card__number');
  const prevNumber = this.page.locator('.swiper-slide-prev .grade-card__number');
  const activeNumber = this.page.locator('.grade-card--active .grade-card__number');

  let target;
  
  if (await prevNumber.count() > 0) {
    target = prevNumber.first();
  }
  else if (await nextNumber.count() > 0) {
    target = nextNumber.first();
  } else  {
    target = activeNumber;
  }

  const grade = (await target.innerText()).trim();

  await target.scrollIntoViewIfNeeded();
  try {
    await target.click({ timeout: 2000 });
  } catch {
    await target.click({ force: true });
  }

  if (!(await activeNumber.count()) || target !== activeNumber) {
    await expect(this.page.locator('.grade-card--active .grade-card__number'))
      .toHaveText(grade);
  }

  return grade;
}

  async finishOnboarding(): Promise<DashboardPage> {
    await expect(this.gradePickerContinueButton).toBeVisible();
    await expect(this.gradePickerContinueButton).toBeEnabled();

    await this.gradePickerContinueButton.click();
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    
    return new DashboardPage(this.page);
  }

  async submitOnboarding(): Promise<void> {
    await expect(this.gradePickerContinueButton).toBeVisible();
    await expect(this.gradePickerContinueButton).toBeEnabled();
    await this.gradePickerContinueButton.click();
  }
}