import { Locator, Page } from '@playwright/test';
import { MediaPicker } from '../media-picker';
/**
 * Create Template dialog
 */
export class CreateTemplatePage {
    private readonly page: Page;
    private readonly templateNameField: Locator;
    private readonly descriptionField: Locator;
    private readonly addTagButton: Locator;
    private readonly createButton: Locator;
    private readonly tagField: Locator;
    private readonly editImageButton: Locator;
    private readonly mediaPicker: MediaPicker;

    constructor(page: Page) {
        this.page = page;
        this.templateNameField = page.getByLabel('Template name');
        this.descriptionField = page.getByLabel('Description');
        this.addTagButton = page.getByRole('button', { name: 'Add tag' }).first();
        this.createButton = page.getByRole('button', { name: 'Create' }).first();
        this.editImageButton = page
            .getByLabel('Edit Image')
            .or(page.locator('flt-semantics[aria-label="Edit Image"]'))
            .or(page.locator('flt-semantics[flt-tappable]').filter({ hasText: /^Edit Image$/ }))
            .first();
    }

    async enterName(name: string) {
        await this.templateNameField.click({ force: true });
        await this.templateNameField.fill(name);
    }

    async enterDescription(description: string) {
        await this.descriptionField.click({ force: true });
        await this.descriptionField.fill(description);
    }

    /**
     * This method doesn't work right now. Could be same issue affecting adding tags
     * to a community space, though the behavior isn't similar when testing manually
     *
     */
    async addTags(tags: string[]) {
        await this.addTagButton.click({ force: true });
        for (const tag of tags) {
            await this.tagField.click({ force: true });
            // Tried fill and pressSequentially, neither will actually put the value in
            await this.tagField.pressSequentially(tag);
            await this.page.getByRole('button', { name: 'Submit Tag' }).click({ force: true });
        }
    }

    async clickCreate() {
        await this.createButton.click({ force: true });
    }

    async selectImage(imageUrl: string) {
        await this.editImageButton.click({ force: true });
        await this.mediaPicker.selectImage(imageUrl);
    }
}
