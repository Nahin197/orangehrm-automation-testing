// pages/LoginPage.js
// Page Object Model for the OrangeHRM Login Page
// Contains all locators and page methods — NO test logic here

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
  }

  // --- Page Methods ---

  /** Navigate to the login page and wait for it to be ready */
  async goto() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /** Fill username and password then click Login */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.page.waitForTimeout(1000);
    await this.passwordInput.fill(password);
    await this.page.waitForTimeout(1000);
    await this.loginButton.click();
  }
}
