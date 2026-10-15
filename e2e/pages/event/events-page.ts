import { Page } from '@playwright/test';
import { CommunityMenuBar } from '../community/community-menu-bar';
/**
 * Events page
 */
export class EventsPage {
    private readonly page: Page;
    private readonly menuBar: CommunityMenuBar;

    constructor(page: Page) {
        this.page = page;
        this.menuBar = new CommunityMenuBar(page);
    }

    async goto() {
        await this.menuBar.clickEvents();
    }

    async clickOnEvent(name: string) {
        const item = this.page
            .getByLabel(new RegExp(name, 'i'))
            .or(this.page.locator(`flt-semantics[aria-label*="${name}"]`))
            .or(this.page.locator(`flt-semantics:text-matches("${name}")`))
            .or(this.page.getByText(name))
            .first();
        await item.click({ force: true });
    }
}
