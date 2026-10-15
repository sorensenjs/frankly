import { Locator, Page, expect } from '@playwright/test';
import { Sidebar } from './sidebar';
/**
 * Top navigation bar on home screen
 */
export class HomeMenuBar {
    protected readonly page: Page;
    private readonly logIn: Locator;
    private readonly signUp: Locator;
    private readonly profileMenuButton: Locator;
    private readonly myProfileMenuItem: Locator;
    private readonly sidebarButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logIn = page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^Log In$/ })
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label="Log In"]'))
            .or(page.locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Log In/ }))
            .or(page.getByRole('button', { name: 'Log In' }))
            .first();
        this.signUp = page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^Sign Up$/ })
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label="Sign Up"]'))
            .or(page.locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Sign Up/ }))
            .or(page.getByRole('button', { name: 'Sign Up' }))
            .first();
        this.profileMenuButton = page
            .getByRole('button', { name: 'Profile Button' })
            .or(page.locator('flt-semantics[aria-label="Profile Button"]'))
            .first();
        this.myProfileMenuItem = page
            .locator('flt-semantics:text-is("My Profile")')
            .or(page.locator('flt-semantics[aria-label="My Profile"]'))
            .or(page.getByText('My Profile'))
            .first();
        this.sidebarButton = page
            .getByRole('button', { name: 'Show Sidebar Button' })
            .or(page.locator('flt-semantics[aria-label="Show Sidebar Button"]'))
            .first();
    }

    async clickLogin() {
        const loginToggle = this.page
            .locator('flt-semantics[flt-tappable]')
            .filter({ hasText: /Already have an account/i })
            .or(this.page.locator('[flt-tappable]').filter({ hasText: /Already have an account/i }))
            .first();
        const loginBtn = this.logIn;
        const loginHeading = this.page
            .locator('flt-semantics:text-is("Log into Frankly")')
            .or(this.page.getByText('Log into Frankly', { exact: true }))
            .or(this.page.locator('flt-semantics').filter({ hasText: /Log into Frankly/ }))
            .first();
        const emailInput = this.page.locator('input[aria-label*="Email"]').first();

        // Wait for page to finish loading: wait for any of loginHeading, loginToggle, or navbar loginBtn
        const authIndicator = loginHeading
            .or(loginToggle)
            .or(loginBtn)
            .first();
        await authIndicator.waitFor({ state: 'visible', timeout: 30000 });

        // If already on the Log In screen/modal, nothing to do
        if (await loginHeading.isVisible().catch(() => false)) {
            return;
        }

        // If the Sign Up screen/modal is currently displayed, switch to Log In
        if (await loginToggle.isVisible().catch(() => false)) {
            await loginToggle.click({ force: true });
            await this.page.waitForTimeout(500);
            await emailInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
            return;
        }

        // Otherwise click the Log In button in the nav bar
        if (await loginBtn.isVisible().catch(() => false)) {
            await loginBtn.click({ force: true });
            await this.page.waitForTimeout(500);

            // If it opened as Sign Up modal, toggle to Log In
            if (await loginToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
                await loginToggle.click({ force: true });
            }
            await emailInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        }
    }

    async clickSignUp() {
        await this.signUp.click();
    }

    async clickSignOut() {
        if (await this.profileButtonVisible()) {
            await this.profileMenuButton.click({ force: true });
            const signOut = this.page
                .locator('flt-semantics[role="button"]:has-text("Sign Out")')
                .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /Sign Out/ }))
                .or(this.page.locator('flt-semantics:text-is("Sign Out")'))
                .or(this.page.locator('flt-semantics[aria-label*="Sign Out"]'))
                .first();
            if (await signOut.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)) {
                await signOut.click({ force: true });
                await this.profileMenuButton.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
            }
        }
    }

    async clickMyProfile() {
        await this.profileMenuButton.click({ force: true });
        const myProfile = this.page
            .locator('flt-semantics:text-is("My Profile")')
            .or(this.page.locator('flt-semantics[role="button"]:has-text("My Profile")'))
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /My Profile/ }))
            .first();
        await myProfile.waitFor({ state: 'visible', timeout: 10000 });
        await myProfile.click({ force: true });
    }

    async profileButtonVisible() {
        let vis = false;
        try {
            await this.profileMenuButton.waitFor({ state: 'visible', timeout: 10000 });
            vis = true;
        } catch (e) {}
        return vis;
    }

    async waitForProfileButton() {
        await this.profileMenuButton.waitFor({ state: 'visible', timeout: 30000 });
    }

    async showSidebar() {
        await this.sidebarButton.click({ force: true });
        return new Sidebar(this.page);
    }
}
