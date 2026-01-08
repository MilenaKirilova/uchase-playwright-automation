import { Page, Locator, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[data-title="login-button"]');
  }

  async open() {
    this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string):Promise<DashboardPage> {
    await this.emailInput.fill(email);
    await this.emailInput.blur();

    await this.passwordInput.fill(password);
    await this.passwordInput.blur();

    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();

    return new DashboardPage(this.page);
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
}