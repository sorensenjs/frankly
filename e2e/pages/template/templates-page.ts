import { Page } from '@playwright/test';
import { CommunityMenuBar } from '../community/community-menu-bar';
/**
 * The Templates page
 */
export class TemplatesPage {
    private readonly page: Page;
    private readonly menuBar: CommunityMenuBar;

    constructor(page: Page) {
        this.page = page;
        this.menuBar = new CommunityMenuBar(page);
    }

    async goto() {
        await this.menuBar.clickTemplates();
    }

    async waitFor() {
        await this.page.waitForFunction(() => {
            const els = Array.from(document.querySelectorAll('flt-semantics, input, button'));
            return els.some(el => {
                const text = el.textContent || el.getAttribute('aria-label') || '';
                if (/Create a template|Add New|No templates|Search templates/i.test(text)) {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                }
                return false;
            });
        }, { timeout: 30000 });
    }

    async clickCreateOrAddNew() {
        const nameField = this.page.getByLabel('Template name');
        for (let attempt = 0; attempt < 3; attempt++) {
            if (await nameField.isVisible().catch(() => false)) {
                break;
            }
            const createBtn = this.page
                .locator('[flt-tappable]')
                .filter({ hasText: /Create a template|Add New/ })
                .or(this.page.locator('flt-semantics[role="button"]:has-text("Create a template")'))
                .or(this.page.getByRole('button', { name: 'Create a template' }))
                .or(this.page.getByRole('button', { name: 'Add New' }))
                .first();
            await createBtn.waitFor({ state: 'visible', timeout: 15000 });
            await createBtn.click({ force: true });
            if (await nameField.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)) {
                break;
            }
        }
    }

    async clickTemplate(name) {
        const loc = this.page
            .locator(`flt-semantics[aria-label*="${name}"][flt-tappable]`)
            .or(this.page.locator(`flt-semantics[aria-label*="${name}"]`))
            .or(this.page.locator('flt-semantics[flt-tappable]').filter({ hasText: name }))
            .or(this.page.locator('flt-semantics[role="button"]').filter({ hasText: name }))
            .first();
        await loc.waitFor({ state: 'visible', timeout: 15000 });
        await loc.click({ force: true });
    }
}
