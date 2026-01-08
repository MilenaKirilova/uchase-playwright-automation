import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { LessonPage } from '../src/pages/LessonPage';
import { DashboardPage } from '../src/pages/DashboardPage';

test.describe('Authenticated user – search and open lesson', () => {
  test('should login, search for a lesson and open lesson content', async ({ page }) => {
    const login = new LoginPage(page);
    let dashboard!: DashboardPage;
    const email = process.env.E2E_EMAIL!;
    const password = process.env.E2E_PASSWORD!;
    
    test.skip(!email || !password, 'Missing E2E credentials');

    await test.step('Login', async () => {
      await login.open();
      await login.acceptCookiesIfPresent();

      dashboard = await login.login(email, password);
    });

    await test.step('User is redirected to dashboard', async () => {
    await dashboard.assertLoaded();
  });

  
    const query = 'Mnożenie i dzielenie przez 10';
    await test.step(`Search lesson ${query}`, async () => {
      await dashboard.searchLesson(query);
      await dashboard.expectSearchResultsVisible(query);
    });

    let lesson: LessonPage;
    await test.step('Open first search result', async () => {
      lesson = await dashboard.openFirstSearchResult();
    });

    await test.step('Lesson page is opened', async () => {
      await lesson.assertLoaded('Mnożenie i dzielenie przez 10');
    });
  });
})
