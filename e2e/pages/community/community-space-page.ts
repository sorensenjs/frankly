import { Locator, Page, expect } from '@playwright/test';
import { Sidebar } from '../sidebar';
import { HomeMenuBar } from '../home-menu-bar';
/**
 * Home page of a Community
 */
export class CommunitySpacePage {
    private readonly page: Page;
    private readonly tagline: Locator;
    private readonly communityNameLocator: Locator;
    private readonly followButton: Locator;
    private readonly menuBar: HomeMenuBar;
    private readonly communityName: String;

    constructor(page: Page, commName: string, tagline: string) {
        this.page = page;
        this.communityName = commName;
        this.communityNameLocator = page.locator(
            'flt-semantics:text-is('.concat("'", commName, "')")
        );
        this.tagline = page.locator('flt-semantics:text-is('.concat("'", tagline, "')"));
        this.followButton = page
            .getByRole('button', { name: 'Follow Community Button', exact: true })
            .or(page.getByLabel('Follow Community Button', { exact: true }))
            .or(page.getByRole('button', { name: 'Follow', exact: true }))
            .or(page.getByText('Follow', { exact: true }))
            .first();
        this.menuBar = new HomeMenuBar(page);
    }

    async goto() {
        if (process.env.TEST_COMMUNITY_URL) {
            await this.page.goto(process.env.TEST_COMMUNITY_URL);
            return;
        }
        const sidebarBtn = this.page.getByRole('button', { name: 'Show Sidebar Button' });
        if (await sidebarBtn.isVisible().catch(() => false)) {
            const sidebar = await this.menuBar.showSidebar();
            await sidebar.clickCommunity(this.communityName);
        }
    }

    async assertVisible() {
        await expect(this.communityNameLocator).toBeVisible({ timeout: 30000 });
        if (await this.tagline.isVisible().catch(() => false)) {
            await expect(this.tagline).toBeVisible();
        }
        // Need to verify about text displayed once fixed - seems to be entirely missing from Semantics tree
        // See about_section.dart

        // Also need to verify tags once we can add them (see bug)
        // And verify background and logo images (using playwright screenshot?)
    }

    async waitFor() {
        await this.tagline.waitFor();
    }

    async clickFollow() {
        const btn = this.page
            .locator('[aria-label="Follow Community Button"] [flt-tappable]')
            .or(this.page.locator('[aria-label="Follow Community Button"]'))
            .or(this.page.locator('[flt-tappable]').filter({ hasText: /^Follow$/ }))
            .or(this.page.locator('flt-semantics:text-is("Follow")'))
            .or(this.followButton)
            .first();
        await btn.click({ force: true });
    }

    async clickUpcomingEvent(eventName: string, eventShortDate: string) {
        const eventItem = this.page
            .getByLabel(new RegExp(eventName, 'i'))
            .or(this.page.locator(`flt-semantics[aria-label*="${eventName}"]`))
            .or(this.page.locator('flt-semantics').filter({ hasText: eventName }))
            .first();
        await eventItem.waitFor({ state: 'visible', timeout: 20000 });
        await eventItem.click({ force: true });
    }
}
