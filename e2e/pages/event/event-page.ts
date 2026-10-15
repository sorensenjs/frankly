import { Locator, Page, expect } from '@playwright/test';
import { MediaPicker } from '../media-picker';
import { AgendaTabPage } from './agenda-tab-page';

export class EventPage {
    private readonly page: Page;
    private eventName: string;
    private eventDate: Date;
    private isPublic: boolean;
    private readonly cancelEventButton: Locator;
    private readonly cancelConfirmationButton: Locator;
    private readonly editTemplateLink: Locator;
    private readonly editEventButton: Locator;
    private readonly rsvpButton: Locator;
    private readonly rsvpConfirmButton: Locator;
    private readonly addToCalendar: Locator;
    private readonly eventStartsInButton: Locator;
    private readonly agendaTab: Locator;

    constructor(page: Page, eventName: string, eventDate: string, isPublic: boolean) {
        this.page = page;
        this.eventName = eventName;
        // For now, we ignore the date passed in because it's not possible to select a date when
        //creating an event
        this.eventDate = new Date();
        this.isPublic = isPublic;
        this.cancelEventButton = page.getByRole('button', { name: /Cancel event/i });
        this.cancelConfirmationButton = page.getByRole('button', { name: /Yes,\s*cancel/i });
        this.editTemplateLink = page.locator('flt-semantics:text-is("edit the template")');
        this.editEventButton = page.locator('flt-semantics:text-is("Edit event")');
        this.rsvpButton = page.getByRole('button', { name: /^RSVP$/i });
        this.rsvpConfirmButton = page.getByRole('button', { name: /I'll be there/i });
        this.addToCalendar = page.locator('flt-semantics:text-matches(".*Add to calendar.*", "i")');
        this.eventStartsInButton = page.getByRole('button', { name: /Starts in/i });
        this.agendaTab = page.locator('flt-semantics:text-is("AGENDA AGENDA")');
    }

    public eventUrl?: string;

    setUrl(url: string) {
        this.eventUrl = url;
    }

    setEventName(eventName: string) {
        this.eventName = eventName;
    }

    setEventDate(date: Date) {
        this.eventDate = date;
    }

    async clickCancelEvent() {
        const btn = this.page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Cancel event/i })
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /Cancel event/i }))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Cancel event" i]'))
            .or(this.page.locator('flt-semantics:text-is("Cancel event")'))
            .or(this.page.locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^Cancel$/i }))
            .or(this.page.locator('flt-semantics:text-is("Cancel")'))
            .or(this.cancelEventButton)
            .first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click({ force: true });
    }

    async clickCancelConfirmation() {
        const btn = this.page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Yes,\s*cancel/i })
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /Yes,\s*cancel/i }))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Yes, cancel" i]'))
            .or(this.cancelConfirmationButton)
            .first();
        try {
            await btn.waitFor({ state: 'visible', timeout: 5000 });
            await btn.click({ force: true });
        } catch {
            // Confirmation dialog may not appear for cancel participation
        }
    }

    async clickEditTemplate() {
        await this.editTemplateLink.click();
    }

    async clickEditEvent() {
        await this.editEventButton.click();
    }

    async clickRSVP() {
        const btn = this.page
            .getByRole('button', { name: /^RSVP$/i })
            .or(this.page.locator('flt-semantics[role="button"][aria-label="RSVP"]'))
            .or(this.page.locator('flt-semantics:text-is("RSVP")'))
            .or(this.page.locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /^RSVP$/i }))
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /^RSVP$/i }))
            .first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click({ force: true });
    }

    async clickRSVPConfirm() {
        const btn = this.page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /I'll be there/i })
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /I'll be there/i }))
            .or(this.page.locator('flt-semantics[role="button"][flt-tappable][aria-label*="be there" i]'))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="be there" i]'))
            .or(this.rsvpConfirmButton)
            .first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click({ force: true });
        await btn.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    async clickAgenda() {
        await this.agendaTab.click();
        return new AgendaTabPage(this.page);
    }

    async clickEnterEvent() {
        const enterOrStartsBtn = this.page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Starts|Enter Event/i })
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /Starts|Enter Event/i }))
            .or(this.page.getByRole('button', { name: /Starts|Enter Event/i }))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Starts" i]'))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Enter Event" i]'))
            .first();
        await enterOrStartsBtn.waitFor({ state: 'visible', timeout: 15000 });
        await enterOrStartsBtn.click({ force: true });

        const saveAndJoinBtn = this.page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Save (&|and) Join/i })
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /Save (&|and) Join/i }))
            .or(this.page.getByRole('button', { name: /Save (&|and) Join/i }))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Save" i]'))
            .first();
        try {
            await saveAndJoinBtn.waitFor({ state: 'visible', timeout: 10000 });
            await saveAndJoinBtn.click({ force: true });
            await saveAndJoinBtn.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        } catch {
            // AV check may not be shown if already completed or disabled
        }
    }

    async assertVisible() {
        const loc = this.page
            .locator(`flt-semantics[aria-label*="${this.eventName}"]`)
            .or(this.page.locator('flt-semantics').filter({ hasText: this.eventName }))
            .or(this.page.getByLabel(new RegExp(this.eventName, 'i')))
            .first();
        await expect(loc).toBeVisible({ timeout: 45000 });
    }

    async assertRegistered() {
        // Add to calendar button is visible only if user is registered for event
        const cal = this.page
            .locator('flt-semantics[aria-label*="calendar" i]')
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: /Add to calendar/i }))
            .or(this.page.locator('flt-semantics').filter({ hasText: /Add to calendar/i }))
            .or(this.addToCalendar)
            .first();
        await expect(cal).toBeVisible({ timeout: 15000 });
    }

    getShortEventDate() {
        const month = this.eventDate.toLocaleString('default', { month: 'short' });
        const day = this.eventDate.getDate();
        return month.toUpperCase().concat(' ', day.toString());
    }

    async enterEvent() {
        // If already registered or enter event button is ready, skip RSVP step
        const enterOrStartsBtn = this.page
            .locator('flt-semantics[role="button"][flt-tappable]').filter({ hasText: /Starts|Enter Event/i })
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: /Starts|Enter Event/i }))
            .or(this.page.getByRole('button', { name: /Starts|Enter Event/i }))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Starts" i]'))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Enter Event" i]'))
            .first();

        if (await enterOrStartsBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await this.clickEnterEvent();
            return;
        }

        // At some point close to the event (15 mins?) you can no longer RSVP and must enter
        // since we can't set the date or time, have to try both
        try {
            await this.clickRSVP();
            await this.clickRSVPConfirm();
            await this.assertRegistered();
        } catch (e) {
            // must be 15 mins or less before the event or already RSVP'd
            console.log('RSVP step not needed or failed, proceeding to enter event:', e);
        }
        await this.clickEnterEvent();
    }

    async assertBanned() {
        await expect(
            this.page.getByLabel(/[\s\S]*You were removed from this event and cannot rejoin./)
        ).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Enter Event' })).toHaveCount(0);
    }
}
