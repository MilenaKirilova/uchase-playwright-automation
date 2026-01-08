import { expect, Locator, Page } from '@playwright/test';

export class LessonPage {
  readonly page: Page;
  readonly title: Locator;
  readonly unlockedMissionCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1.mission-title-txt[data-title="mission-title"]');
    this.unlockedMissionCard = page.locator('[data-title="mission-unlocked"]');
  }

  async assertLoaded(expectedTitle?: string) {
    await expect(this.title).toBeVisible();
    await expect(this.unlockedMissionCard.first()).toBeVisible();

    if (expectedTitle) {
      await expect(this.title).toContainText(expectedTitle);
    }
  }
}