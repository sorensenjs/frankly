import { Locator, Page } from '@playwright/test';
/**
 * The navigation sidebar
 */
export class Sidebar {
    private readonly page: Page;
    private readonly unfollowButton: Locator;
    private readonly followButton: Locator;
    private readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.unfollowButton = page
            .getByRole('button', { name: 'Sidebar Unfollow Button', exact: true })
            .or(page.getByLabel('Sidebar Unfollow Button', { exact: true }))
            .or(page.locator('[aria-label="Sidebar Unfollow Button"]'))
            .or(page.locator('flt-semantics:text-is("Unfollow")'))
            .or(page.getByText('Unfollow', { exact: true }))
            .first();

        this.followButton = this.page
            .getByRole('button', { name: 'Sidebar Follow Community Button', exact: true })
            .or(this.page.getByLabel('Sidebar Follow Community Button', { exact: true }))
            .or(this.page.locator('[aria-label="Sidebar Follow Community Button"]'))
            .or(this.page.getByRole('button', { name: 'Follow', exact: true }))
            .or(this.page.getByText('Follow', { exact: true }))
            .first();

        this.closeButton = this.page
            .getByLabel('Close')
            .or(this.page.getByRole('button', { name: 'Close' }))
            .or(this.page.locator('[aria-label="Close"]'))
            .first();
    }

    async clickUnfollow() {
        const unfollowBtn = this.page
            .locator('[aria-label="Sidebar Unfollow Button"] [flt-tappable]')
            .or(this.page.locator('[aria-label="Sidebar Unfollow Button"]'))
            .or(this.unfollowButton)
            .first();
        if (await unfollowBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await unfollowBtn.click({ force: true });
            const yesBtn = this.page
                .locator('[flt-tappable]')
                .filter({ hasText: /^Yes$/ })
                .or(this.page.locator('flt-semantics:text-is("Yes")'))
                .or(this.page.getByRole('button', { name: 'Yes', exact: true }))
                .first();
            if (await yesBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await yesBtn.click({ force: true });
            }
        }
    }

    async clickFollow() {
        const btn = this.page
            .locator('[aria-label="Sidebar Follow Community Button"] [flt-tappable]')
            .or(this.page.locator('[aria-label="Sidebar Follow Community Button"]'))
            .or(this.followButton)
            .first();
        await btn.click({ force: true });
    }

    async clickClose() {
        if (await this.closeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.closeButton.click({ force: true });
        }
    }

    async waitFor() {
        await this.closeButton.waitFor();
    }

    async clickCommunity(name) {
        const commItem = this.page.locator('flt-semantics:text-is("'.concat(name, '")')).or(this.page.getByText(name)).first();
        await commItem.waitFor({ state: 'visible', timeout: 15000 });
        await commItem.click({ force: true });
    }
}
