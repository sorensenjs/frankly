import { Locator, Page, expect } from '@playwright/test';
import { HomeMenuBar } from '../home-menu-bar';

/**
 * Top navigation bar on a Community home page
 */
export class CommunityMenuBar extends HomeMenuBar {
    private readonly events: Locator;
    private readonly posts: Locator;
    private readonly resources: Locator;
    private readonly templates: Locator;
    private readonly announcements: Locator;
    private readonly profileMenu: Locator;
    private readonly settings: Locator;
    private readonly announcementsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.events = this.page
            .locator('flt-semantics[role="button"][flt-tappable]')
            .filter({ hasText: /^Events$/ })
            .or(this.page.getByRole('button', { name: 'Events', exact: true }))
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Events$/ }))
            .first();
        this.posts = this.page
            .locator('flt-semantics[role="button"][flt-tappable]')
            .filter({ hasText: /^Posts$/ })
            .or(this.page.getByRole('button', { name: 'Posts', exact: true }))
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Posts$/ }))
            .first();
        this.resources = this.page
            .locator('flt-semantics[role="button"][flt-tappable]')
            .filter({ hasText: /^Resources$/ })
            .or(this.page.getByRole('button', { name: 'Resources', exact: true }))
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Resources$/ }))
            .first();
        this.templates = this.page
            .locator('flt-semantics[role="button"][flt-tappable]')
            .filter({ hasText: /^Templates$/ })
            .or(this.page.getByRole('button', { name: 'Templates', exact: true }))
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Templates$/ }))
            .first();
        this.announcementsButton = this.page.getByRole('button', {
            name: 'Show Announcements Button',
        }).first();
    }

    async clickEvents() {
        await this.events.waitFor({ state: 'visible', timeout: 15000 });
        await this.events.click({ force: true });
    }

    async clickTemplates() {
        await this.templates.waitFor({ state: 'visible', timeout: 15000 });
        await this.templates.click({ force: true });
    }

    async clickPosts() {
        await this.posts.waitFor({ state: 'visible', timeout: 15000 });
        await this.posts.click({ force: true });
    }

    async assertVisible() {
        await expect(this.events).toBeVisible({ timeout: 30000 });
    }

    async assertAnnouncementsVisible() {
        await expect(this.announcementsButton).toBeVisible({ timeout: 30000 });
    }
}
