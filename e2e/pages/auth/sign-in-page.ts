import { Locator, Page } from '@playwright/test';

/**
 * SignIn Dialog Box
 */
export class SignInPage {
    private readonly page: Page;
    private readonly signInWithEmailButton: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInWithEmailButton = page.getByRole('button', { name: 'Sign in with Email' })
            .or(page.locator('flt-semantics[aria-label*="Sign in with Email"]'))
            .or(page.getByText('Sign in with Email'))
            .first();
        this.emailInput = page.getByLabel('Email', { exact: true })
            .or(page.locator('input[aria-label="Email"]'))
            .or(page.locator('input[aria-label*="Email"]'))
            .first();
        this.passwordInput = page.locator('input[aria-label*="Password"]')
            .or(page.getByLabel(/Password/))
            .first();
        this.signInButton = page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^Sign In$|^Log In$/ })
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label="Sign In"]'))
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label="Log In"]'))
            .or(page.getByLabel('Log In', { exact: true }))
            .or(page.getByRole('button', { name: 'Log In', exact: true }))
            .or(page.getByRole('button', { name: 'Sign In', exact: true }))
            .first();
    }

    async enterEmail(user: string) {
        await this.emailInput.click({ force: true });
        await this.emailInput.fill(user);
    }

    async enterPassword(pwd: string) {
        await this.passwordInput.click({ force: true });
        await this.passwordInput.fill(pwd);
        await this.passwordInput.press('Enter').catch(() => {});
    }

    async clickSignInWithEmail() {
        if (await this.signInWithEmailButton.isVisible().catch(() => false)) {
            await this.signInWithEmailButton.click({ force: true });
        }
    }

    async clickSignIn() {
        try {
            await this.signInButton.waitFor({ state: 'visible', timeout: 3000 });
            await this.signInButton.click({ force: true, timeout: 3000 });
        } catch (e) {
            // Already submitted via Enter or modal dismissed
        }
    }

    async waitFor() {
        await this.emailInput.waitFor().catch(async () => {
            await this.signInWithEmailButton.waitFor();
        });
    }

    async waitForEmailSignIn() {
        await this.emailInput.waitFor();
    }
}
