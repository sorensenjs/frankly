import { expect, Locator, Page } from '@playwright/test';
/**
 * The home page
 */
export class HomePage {
    private readonly page: Page;
    private readonly startCommunityButton: Locator;
    private readonly myCommunities: Locator;

    constructor(page: Page) {
        this.page = page;
        this.startCommunityButton = page.getByRole('button', { name: /Start a community/i });
        this.myCommunities = page.locator('flt-semantics:has-text("My Communities")');
    }

    async goto() {
        await this.page.goto('/');
    }

    async assertStartCommunityNotVisible() {
        expect(this.startCommunityButton).toHaveCount(0);
    }

    async clickStartCommunity() {
        await this.startCommunityButton.waitFor({ state: 'visible', timeout: 30000 });
        await this.startCommunityButton.click({ force: true });
    }

    async waitFor() {
        await this.myCommunities.waitFor();
    }
}
