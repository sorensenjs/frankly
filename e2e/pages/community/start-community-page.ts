import { Locator, Page, expect } from '@playwright/test';
import { MediaPicker } from '../media-picker';
/**
 * Start a Community dialog
 */
export class StartCommunityPage {
    private readonly page: Page;
    private readonly agreeAndContinueButton: Locator;
    private readonly communityNameField: Locator;
    private readonly taglineField: Locator;
    private readonly aboutField: Locator;
    private readonly logoButton: Locator;
    private readonly backgroundButton: Locator;
    private readonly contactField: Locator;
    private readonly privateSpaceBox: Locator;
    private readonly nextButton: Locator;
    private readonly finishButton: Locator;
    private readonly mediaPicker: MediaPicker;
    private readonly addTagButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.agreeAndContinueButton = page.getByRole('button', { name: 'Agree and continue' }).first();
        this.communityNameField = page.getByLabel('Name');
        this.taglineField = page.getByLabel('Tagline');
        this.aboutField = page.getByLabel('About');
        this.logoButton = page.getByRole('button', { name: 'Logo' }).first();
        this.backgroundButton = page.getByRole('button', { name: 'Background' }).first();
        this.contactField = page.getByLabel('Contact email');
        this.privateSpaceBox = page.getByLabel('Make this space private');
        this.nextButton = page.getByLabel('Next', { exact: true }).or(page.getByRole('button', { name: 'Next', exact: true })).first();
        this.finishButton = page.getByLabel('Finish', { exact: true }).or(page.getByRole('button', { name: 'Finish', exact: true })).first();
        this.addTagButton = page.getByRole('button', { name: 'Add tag' }).first();
        this.mediaPicker = new MediaPicker(page);
    }

    async clickAgreeAndContinue() {
        if (await this.agreeAndContinueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await this.agreeAndContinueButton.click({ force: true });
        }
    }

    async enterCommunityName(commName: string) {
        await this.communityNameField.waitFor({ state: 'visible', timeout: 20000 });
        await this.communityNameField.click({ force: true });
        await this.communityNameField.fill(commName);
    }

    async enterTagline(tagline: string) {
        if (await this.taglineField.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.taglineField.click({ force: true });
            await this.taglineField.fill(tagline);
        }
    }

    async enterAbout(about: string) {
        if (await this.aboutField.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.aboutField.click({ force: true });
            await this.aboutField.fill(about);
        }
    }

    async selectBackground(backgroundUrl: string) {
        if (await this.backgroundButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.backgroundButton.click({ force: true });
            await this.mediaPicker.selectImage(backgroundUrl);
        }
    }

    async selectLogo(logoUrl: string) {
        if (await this.logoButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.logoButton.click({ force: true });
            await this.mediaPicker.selectImage(logoUrl);
        }
    }

    async enterContactEmail(email: string) {
        if (await this.contactField.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.contactField.click({ force: true });
            await this.contactField.fill(email);
        }
    }

    async checkPrivate() {
        await this.privateSpaceBox.click({ force: true });
        expect(await this.privateSpaceBox.isChecked()).toBeTruthy();
    }

    async clickNext() {
        await this.nextButton.click({ force: true });
    }

    async clickFinish() {
        await this.finishButton.click({ force: true });
    }

    async waitFor() {
        await this.agreeAndContinueButton.waitFor();
    }

    async waitForInputFields() {
        await this.communityNameField.waitFor();
    }

    async waitForBranding() {
        await this.addTagButton.waitFor();
    }
}
