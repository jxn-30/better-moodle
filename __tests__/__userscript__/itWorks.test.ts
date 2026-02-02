import { isCI } from 'ci-info';
import { page } from '../puppeteer';
import settingsStyle from '#style/settings.module.scss';
import { beforeAll, describe, expect, test } from 'vitest';

// first of all, we want to test if tests are working :)
test('1 + 2 = 3', () => expect(1 + 2).toBe(3));

// On UzL, we need to login as a guest
if (__UNI__ === 'uzl') {
    beforeAll(async () => {
        // login as guest
        await page.locator('#loginguestbtn').click();
        await page.waitForNavigation();
    });
}

describe('We can run Better-Moodle in a userscript in a Browser!', () => {
    if (__UNI__ === 'uzl') {
        test('We should be on UzL-Moodle', async () => {
            const title = await page.title();
            expect(title).toEndWith('Moodle der Universität zu Lübeck');
        });
    }

    test('Better-Moodle has appended the settings icon to the navbar', async () => {
        // now check for existence of the button
        const settingsBtn = await page.$(`#${settingsStyle.openSettingsBtn}`);
        expect(settingsBtn).not.toBeNull();
    });
});

if (!isCI) {
    test('manueller Stopp', async () => {
        console.log('Browser bleibt offen...');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await new Promise(() => {}); // hängt für immer
    });
}
