import { Locator, Page, expect } from '@playwright/test';
import { MediaPicker } from '../media-picker';
/**
 * The page displayed when you select a single Template
 */
export class TemplatePage {
    private readonly page: Page;
    private readonly nameText: Locator;
    private description: string;
    private readonly editTemplateButton: Locator;
    private readonly removeTemplateButton: Locator;
    private readonly createEventButton: Locator;
    private readonly hostedRadioButton: Locator;
    private readonly saveTemplateButton: Locator;
    private readonly mediaPicker: MediaPicker;

    constructor(page: Page, name: string) {
        this.page = page;
        this.nameText = page
            .locator('flt-semantics')
            .filter({ hasText: name })
            .or(page.locator(`flt-semantics[aria-label*="${name}"]`))
            .or(page.locator(`flt-semantics:text-is("${name}")`))
            .first();
        this.editTemplateButton = page
            .getByLabel('Edit template')
            .or(page.locator('[aria-label="Edit template"]'))
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /Edit template/i }))
            .first();
        this.removeTemplateButton = page
            .getByRole('button', { name: /Remove Template/i })
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /Remove Template/i }))
            .first();
        this.saveTemplateButton = page
            .getByRole('button', { name: /Save Template/i })
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /Save Template/i }))
            .first();
        this.createEventButton = page
            .locator('flt-semantics[role="button"][flt-tappable]')
            .filter({ hasText: /^Create event$/ })
            .or(page.getByRole('button', { name: 'Create event', exact: true }))
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Create event$/ }))
            .first();
        this.hostedRadioButton = page
            .locator('flt-semantics[flt-tappable]')
            .filter({ hasText: /^Hosted$/ })
            .or(page.locator('flt-semantics[role="radio"]').filter({ hasText: /^Hosted$/ }))
            .or(page.getByRole('radio', { name: 'Hosted' }))
            .first();
        this.mediaPicker = new MediaPicker(page);
    }

    setDescription(description: string) {
        this.description = description;
    }

    async clickEditTemplate() {
        await this.editTemplateButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        await this.editTemplateButton.click({ force: true });
    }

    async clickRemoveTemplate() {
        await this.removeTemplateButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        await this.removeTemplateButton.click({ force: true });
    }

    async clickSaveTemplate() {
        await this.saveTemplateButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        await this.saveTemplateButton.click({ force: true });
    }

    async clickCreateEvent() {
        await this.createEventButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.createEventButton.click({ force: true });
    }

    async selectHostedEvent() {
        await this.hostedRadioButton.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
        await this.hostedRadioButton.click({ force: true });
    }

    async selectImageFromEditMenu(imageUrl: string) {
        const imageElement = this.page
            .locator('flt-semantics:has-text("Image") ~ flt-semantics[role="button"]')
            .or(this.page.locator('flt-semantics:has-text("Image") flt-semantics[role="button"]'))
            .or(this.page.locator('flt-semantics:text-is("Image")'))
            .or(this.page.getByText('Image'))
            .first();
        await imageElement.click({ force: true });
        await this.mediaPicker.selectImage(imageUrl);
    }

    async selectEditableImage(imageUrl: string) {
        await this.page.getByLabel('Edit Image').or(this.page.locator('flt-semantics[aria-label="Edit Image"]')).or(this.page.locator('flt-semantics:has-text("Edit Image")')).first().click({ force: true });
        await this.mediaPicker.selectImage(imageUrl);
    }

    async assertVisible() {
        await expect(this.nameText).toBeVisible({ timeout: 30000 });
        if (this.description) {
            const desc = this.page
                .locator('flt-semantics')
                .filter({ hasText: this.description })
                .or(this.page.locator(`flt-semantics[aria-label*="${this.description}"]`))
                .first();
            await expect(desc).toBeVisible({ timeout: 15000 });
        }
        // Need to do image and tag validation once tags can be set
    }
}
