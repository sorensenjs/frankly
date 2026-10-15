import { Locator, Page, expect } from '@playwright/test';
/**
 * Page for a live event
 */
export class LiveMeetingPage {
    private readonly page: Page;
    private readonly startVideoButton: Locator;
    private readonly stopVideoButton: Locator;
    private readonly muteButton: Locator;
    private readonly unmuteButton: Locator;
    private readonly agendaButton: Locator;
    private readonly chatButton: Locator;
    private readonly chatField: Locator;
    private readonly startEventButton: Locator;
    private readonly nextButton: Locator;
    private readonly refreshConnectionButton: Locator;
    private readonly addItemButton: Locator;
    private readonly itemTitleField: Locator;
    private readonly itemContentField: Locator;
    private readonly saveItemButton: Locator;
    private readonly leaveButton: Locator;
    private readonly finishButton: Locator;
    private readonly adminButton: Locator;
    private readonly kickButton: Locator;
    private readonly removeParticipantButton: Locator;
    private readonly breakoutsButton: Locator;
    private readonly randomlyAssignButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.startVideoButton = page.locator('flt-semantics:text-is("Start Video")');
        this.stopVideoButton = page.locator('flt-semantics:text-is("Stop Video")');
        this.muteButton = page.locator('flt-semantics:text-is("Mute")');
        this.unmuteButton = page.locator('flt-semantics:text-is("Unmute")');
        this.agendaButton = page.locator('flt-semantics:text-is("Agenda")');
        this.chatButton = page
            .getByRole('tab', { name: /Chat/i })
            .or(page.getByRole('button', { name: /Chat/i }))
            .or(page.locator('flt-semantics:text-is("Chat")'))
            .or(page.locator('flt-semantics[aria-label*="Chat"]'))
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Chat$/ }))
            .first();
        this.adminButton = page.locator('flt-semantics:text-is("Admin")');
        // There will be two of these if chat menu has been selected, for now use either one
        this.chatField = page
            .getByLabel(/Say something/i)
            .or(page.getByPlaceholder(/Say something/i))
            .or(page.locator('flt-semantics[aria-label*="Say something" i]'))
            .or(page.locator('textarea[placeholder*="Say something" i]'))
            .or(page.locator('input[placeholder*="Say something" i]'))
            .or(page.locator('textarea[aria-label*="Say something" i]'))
            .or(page.locator('input[aria-label*="Say something" i]'))
            .first();
        this.startEventButton = page.getByRole('button', { name: 'Start event' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.kickButton = page.getByRole('button', { name: 'Kick' });
        this.refreshConnectionButton = page.locator('flt-semantics:text-is("Refresh Connection")');
        this.addItemButton = page.locator('flt-semantics:text-is("Add agenda item")');
        this.itemTitleField = page.getByLabel('Title', { exact: true });
        this.itemContentField = page.getByLabel('Content');
        this.saveItemButton = page.getByRole('button', { name: 'Save Agenda Item' });
        this.leaveButton = page
            .getByRole('button', { name: 'Leave' })
            .or(page.locator('flt-semantics:text-is("Leave")'))
            .or(page.locator('flt-semantics[aria-label*="Leave"]'))
            .first();
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.removeParticipantButton = page.getByRole('button', { name: 'Remove Participant' });
        this.breakoutsButton = page.getByRole('button', { name: 'Breakouts' });
        this.randomlyAssignButton = page.getByRole('button', { name: 'Randomly Assign' });
    }

    async clickStartEvent() {
        await this.startEventButton.click();
    }

    async clickNext() {
        await this.nextButton.click();
    }

    async clickAgenda() {
        await this.agendaButton.click();
    }

    async clickAddItem() {
        await this.addItemButton.click();
    }

    async clickSaveItem() {
        await this.saveItemButton.click();
    }

    async enterItemTitle(title: string) {
        await this.itemTitleField.focus();
        await this.itemTitleField.click();
        await this.itemTitleField.fill(title);
    }

    async enterItemContent(content: string) {
        await this.itemContentField.click();
        await this.itemContentField.fill(content);
    }

    async assertAgendaItemVisible(itemheading: string) {
        await expect(this.page.getByLabel(new RegExp(itemheading.concat('.*')))).toBeVisible();
    }

    async assertAgendaItemCardVisible(itemheading: string) {
        await expect(
            this.page.locator('flt-semantics:text-is("'.concat(itemheading, '")'))
        ).toBeVisible();
    }

    async clickChat() {
        await this.chatButton.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
        await this.chatButton.click({ force: true });
    }

    async enterMessageMainScreen(msg: string) {
        await this.chatField.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
        await this.chatField.click({ force: true });
        await this.chatField.fill(msg);
        const submitBtn = this.page
            .getByRole('button', { name: /Submit (Chat|Message) Button/i })
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Submit" i]'))
            .or(this.page.locator('flt-semantics[aria-label*="Submit" i]'))
            .or(this.page.locator('[aria-label*="Submit" i]'))
            .first();
        if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click({ force: true });
        } else {
            await this.chatField.press('Enter').catch(() => {});
        }
    }

    async enterMessageChatWindow(msg: string) {
        const chatInputs = this.page
            .getByLabel(/Say something/i)
            .or(this.page.getByPlaceholder(/Say something/i))
            .or(this.page.locator('flt-semantics[aria-label*="Say something" i]'))
            .or(this.page.locator('textarea[placeholder*="Say something" i]'))
            .or(this.page.locator('input[placeholder*="Say something" i]'))
            .or(this.page.locator('textarea[aria-label*="Say something" i]'))
            .or(this.page.locator('input[aria-label*="Say something" i]'));

        await chatInputs.first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
        const targetInput = chatInputs.first();
        await targetInput.click({ force: true });
        await targetInput.fill(msg);
        const submitBtn = this.page
            .getByRole('button', { name: /Submit (Message|Chat) Button/i })
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Submit Message Button" i]'))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Submit Chat Button" i]'))
            .or(this.page.locator('flt-semantics[aria-label*="Submit Message Button" i]'))
            .or(this.page.locator('flt-semantics[aria-label*="Submit Chat Button" i]'))
            .or(this.page.locator('[aria-label*="Submit Message Button" i]'))
            .or(this.page.locator('[aria-label*="Submit Chat Button" i]'))
            .or(this.page.locator('flt-semantics[role="button"][aria-label*="Submit" i]'))
            .or(this.page.locator('flt-semantics[aria-label*="Submit" i]'))
            .or(this.page.locator('[aria-label*="Submit" i]'))
            .first();
        if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click({ force: true });
        } else {
            await targetInput.press('Enter').catch(() => {});
        }
    }

    async assertMessageVisible(message: string) {
        await expect(this.page.getByLabel(new RegExp(message.concat('.*')))).toBeVisible();
    }

    async clickStartVideo() {
        await this.startVideoButton.click();
    }

    async clickUnmute() {
        await this.unmuteButton.click();
    }

    async clickStopVideo() {
        await this.stopVideoButton.click();
    }

    async clickMute() {
        await this.muteButton.click();
    }

    async clickRefreshConnection() {
        await this.refreshConnectionButton.click();
    }

    async assertParticipantPresent(participantName: string) {
        await expect(
            this.page.getByLabel(new RegExp('.*'.concat(participantName, '.*')))
        ).toBeVisible();
    }

    async assertParticipantNotPresent(participantName: string) {
        await expect(
            this.page.getByLabel(new RegExp('.*'.concat(participantName, '.*')))
        ).toHaveCount(0);
    }

    async assertEventParticipantVideoOff(participantName: string) {
        await expect(this.page.getByLabel('Video Off'.concat(' ', participantName))).toBeVisible();
    }

    async assertEventParticipantVideoOn(participantName: string) {
        // participant is here
        await this.assertParticipantPresent(participantName);
        // but video does not show as off
        const re = new RegExp('.*'.concat('Video Off', '\\s*', participantName, '.*'));
        await expect(this.page.getByLabel(re)).toHaveCount(0);
    }

    async assertInBreakoutRoom() {
        await this.adminButton.click();
        // Can take a little bit to get into the breakout room
        await expect(this.page.getByRole('button', { name: 'View Current Room' })).toBeVisible({
            timeout: 20000,
        });
        await this.adminButton.click();
    }

    async clickLeave() {
        await this.leaveButton.click();
    }

    async clickFinish() {
        await this.finishButton.click();
    }

    async leaveEvent() {
        try {
            if (await this.leaveButton.isVisible({ timeout: 4000 }).catch(() => false)) {
                await this.clickLeave();
                try {
                    await this.nextButton.click({ timeout: 4000 });
                } catch {
                    // sometimes there is a feedback screen, but not always
                }
                if (await this.finishButton.isVisible({ timeout: 4000 }).catch(() => false)) {
                    await this.clickFinish();
                }
            }
        } catch {
            // might not have made it into event
        }
    }

    async clickAdmin() {
        await this.adminButton.click();
    }

    async clickKick() {
        await this.kickButton.click();
    }

    async clickRemoveParticipant() {
        await this.removeParticipantButton.click();
    }

    async showParticipantActionMenu() {
        await this.page.locator('flt-semantics:text-is("Participant Actions")').click();
    }

    async clickBreakouts() {
        await this.breakoutsButton.click();
    }

    async clickRandomlyAssign() {
        await this.randomlyAssignButton.click();
    }

    async clickBreakoutRoom(roomName: string) {
        await this.page
            .locator('flt-semantics:text-matches("'.concat(roomName, '.*", "i")'))
            .click();
    }

    /**
     *
     * This does not currently work because playwright in unable to read the inputvalue
     * from the textarea element. Not sure why.
     */
    async assertChatMessageVisible(msg: string) {
        const locator = this.page.getByLabel('Message', { exact: true });
        const elementCount = await locator.count();
        let matched = false;
        for (var index = 0; index < elementCount; index++) {
            const value = await locator.nth(index).inputValue();
            if (value == msg) {
                matched = true;
                break;
            }
        }
        expect(matched).toBeTruthy();
    }
}
