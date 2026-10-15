import { Locator, Page } from '@playwright/test';
/**
 * Create Event dialog
 */
export class CreateEventPage {
    private readonly page: Page;
    private readonly publicEventRadioButton: Locator;
    private readonly privateEventRadioButton: Locator;
    private readonly nextButton: Locator;
    private readonly createEventButton: Locator;
    private readonly confirmationButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.publicEventRadioButton = page
            .locator('flt-semantics[role="radio"][flt-tappable]').first()
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Allow the community to join$/ }))
            .first();
        this.privateEventRadioButton = page
            .locator('flt-semantics[role="radio"][flt-tappable]').nth(1)
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^I'll share this with a private group$/ }))
            .first();
        this.nextButton = page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^Next$/ })
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label="Next"]'))
            .first();
        this.createEventButton = page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^Create Event$/ })
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label="Create Event"]'))
            .first();
        this.confirmationButton = page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /I'll be there/i })
            .or(page.locator('flt-semantics[role="button"][flt-tappable][aria-label*="be there"]'))
            .first();
    }

    async clickNext() {
        await this.nextButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.nextButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    async selectPublic() {
        await this.publicEventRadioButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.publicEventRadioButton.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    async selectPrivate() {
        await this.privateEventRadioButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.privateEventRadioButton.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    async enterDate(date: string) {
        //currently not possible, manipulating sliders is tricky. need input field (see backlog)
    }

    async enterTime(time: string) {
        // currently not possible, manipulating sliders is tricky. need input field (see backlog)
    }

    async clickCreateEvent() {
        await this.createEventButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.createEventButton.click({ force: true });
    }

    async clickConfirm() {
        if (await this.confirmationButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.confirmationButton.click({ force: true });
        }
    }
}
