import { Page, Locator, expect } from '@playwright/test';
import { LessonPage } from '../pages/LessonPage';

export class DashboardPage {
    readonly page: Page;
    readonly subjectCardChip: Locator

    constructor(page: Page) {
        this.page = page;
        this.subjectCardChip = this.page.locator('.subject-card-chip');
    }

    async open() {
        await this.page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
        await this.assertLoaded();
    }

    async assertLoaded() {
        await expect(this.page).toHaveURL(/\/dashboard/);
        await expect(this.subjectCardChip.first()).toBeVisible({ timeout: 10000 });
    }
    
    async assertGradeShownInFirstTwoCards(selectedGrade: string) {
        await expect(this.subjectCardChip.nth(0)).toContainText(selectedGrade);
        await expect(this.subjectCardChip.nth(1)).toContainText(selectedGrade);
    }

    async searchLesson(query: string) {
        const searchButton = this.page.locator('[data-title="search-btn"]');
        const searchInput = this.page
            .locator('input[name="side-search"]')
            .first();

        await expect(searchButton).toBeVisible({ timeout: 10000 });
        await searchButton.click();

        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await expect(searchInput).toBeEnabled();

        await searchInput.fill(query);

        await searchInput.press('Enter').catch(() => {});

        await this.page.waitForTimeout(300);
    }

    async expectSearchResultsVisible(query: string) {
        const resultsContainer = this.page.locator('#results-container');
        const resultItems = resultsContainer.locator('.search-result-item');

        await expect(resultsContainer).toBeVisible();

        await expect(resultItems.first()).toBeVisible();
        await expect(this.page.locator('.search-result-item')).toContainText(query);
    }

    async openFirstSearchResult(): Promise<LessonPage> {
        const firstResult = this.page
            .locator('.search-result-item')
            .first();

        await expect(firstResult).toBeVisible();
        await firstResult.click();

        return new LessonPage(this.page);
    }
}