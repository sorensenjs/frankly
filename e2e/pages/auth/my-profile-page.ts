import { Locator, Page } from '@playwright/test';
import { MediaPicker } from '../media-picker';

/**
 * My Profile page
 */
export class MyProfilePage {
    private readonly page: Page;
    private readonly mediaPicker: MediaPicker;
    private readonly profileTab: Locator;
    private readonly editImageButton: Locator;
    private readonly updateProfileButton: Locator;
    private readonly eventsTab: Locator;
    private readonly upcomingEvents: Locator;
    private readonly notificationsTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mediaPicker = new MediaPicker(page);
        this.profileTab = page.locator('flt-semantics:text-is("PROFILE PROFILE")').or(page.getByText('PROFILE', { exact: true })).first();
        this.editImageButton = page.getByLabel('Edit Image').or(page.locator('flt-semantics[aria-label="Edit Image"]')).or(page.locator('flt-semantics:has-text("Edit Image")')).first();
        this.eventsTab = page.locator('flt-semantics:text-is("MY EVENTS MY EVENTS")').or(page.getByText('MY EVENTS', { exact: true })).first();
        this.upcomingEvents = page.getByLabel('UPCOMING');
        this.updateProfileButton = page.getByRole('button', { name: 'Update Profile' }).or(page.locator('flt-semantics:has-text("Update Profile")')).first();
        this.notificationsTab = page.locator('flt-semantics:text-is("NOTIFICATIONS NOTIFICATIONS")').or(page.getByText('NOTIFICATIONS', { exact: true })).first();
    }

    async clickProfile() {
        await this.profileTab.click({ force: true });
    }

    async selectProfileImage(imageUrl: string) {
        await this.editImageButton.click({ force: true });
        await this.mediaPicker.selectImage(imageUrl);
    }

    async clickUpdateProfile() {
        await this.updateProfileButton.click({ force: true });
    }

    async clickMyEvents() {
        await this.eventsTab.click({ force: true });
    }

    async clickNotifications() {
        await this.notificationsTab.click({ force: true });
    }

    async waitForMyEvents() {
        await this.upcomingEvents.waitFor();
    }

    async waitForProfile() {
        await this.profileTab.waitFor();
    }
}
