import { Downloader } from 'nodejs-file-downloader';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import unzip from '@tomjs/unzip-crx';
import { afterAll, beforeAll, inject, vi } from 'vitest';
import puppeteer, { type Browser, type Page } from 'puppeteer';

/**
 * Downloads an extension from the chrome webstore and unpacks it
 * @param id - the extension id
 * @returns a promise that resolves to the directory where the unpacked extension lives in
 */
const downloadExtension = async (id: string) => {
    const downloadUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=138.0.7204.92&acceptformat=crx2,crx3&x=id%3D${id}%26uc`;
    const extensionDir = await mkdtemp(join(tmpdir(), 'crx-'));

    const downloader = new Downloader({
        url: downloadUrl,
        directory: tmpdir(),
        fileName: `${id}.crx`,
    });
    const { filePath } = await downloader.download();

    if (!filePath) throw new Error('No filePath received :(');

    await unzip(filePath, extensionDir);

    return extensionDir;
};

const tampermonkeyDir = await downloadExtension(
    'dhdgffkkebhmkfjojejmpbldmpobfkfo'
);

vi.stubEnv('CHROME_DEVEL_SANDBOX', '/usr/local/sbin/chrome-devel-sandbox');

let browser: Browser;
let page: Page;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        enableExtensions: [tampermonkeyDir],
        pipe: true,
        // dumpio: true,
    });

    // if the tampermonkey installation page appears, close it
    void browser
        .waitForTarget(target =>
            target.url().startsWith('https://www.tampermonkey.net/')
        )
        .then(target => target.page())
        .then(page => page?.close());

    // enable developer mode and find tampermonkey extension-ID
    const devmodePage = await browser.newPage();
    await devmodePage.goto('chrome://extensions/');
    await devmodePage.click('body >>> #devMode');
    const tampermonkeyID = await devmodePage.$$eval(
        'body >>> extensions-item',
        els =>
            els.find(el =>
                el.shadowRoot
                    ?.getElementById('name')
                    ?.textContent?.includes('Tampermonkey')
            )?.id
    );
    if (!tampermonkeyID) {
        throw new Error('Could not find the Extension-ID of Tampermonkey :(');
    }

    // allow tampermonkey to run userscripts
    await devmodePage.goto(`chrome://extensions/?id=${tampermonkeyID}`);
    await devmodePage
        .locator('body >>> extensions-toggle-row#allow-user-scripts')
        .click();

    await devmodePage.close();

    // install the current script version
    // // this double-commented method throws a net::ERR_ABORTED ???
    // // const scriptPage = await browser.newPage();
    // // await scriptPage.goto('file://' + inject('userscriptFile'));
    const tampermonkeyPage = await browser.newPage();
    await tampermonkeyPage.goto(
        `chrome-extension://${tampermonkeyID}/options.html#nav=utils`
    );
    // const fileChooserPromise = tampermonkeyPage.waitForFileChooser();
    await tampermonkeyPage.$eval(
        '.section input.updateurl_input',
        (el, value) => {
            el.value = value;
        },
        `file://${inject('userscriptFile')}`
    );
    const installPageTarget = browser
        .waitForTarget(target =>
            target
                .url()
                .startsWith(`chrome-extension://${tampermonkeyID}/ask.html`)
        )
        .then(target => target.page());
    await tampermonkeyPage
        .locator('.section input.updateurl_input + input[type="button"]')
        .click();
    const installPage = await installPageTarget;
    if (!installPage) {
        throw new Error('Tampermonkey did not ask for installation?');
    }
    // can we rely on the fact that the install button is the first and the abort button is the second?
    await installPage.locator('input.button.install[type="button"]').click();
    await tampermonkeyPage.close();

    // Now we need to wait like 40 seconds or so till chromium knows that tampermonkey is allowed to execute userscripts? I am confused!

    // open the moodle
    page = await browser.newPage();
    await page.goto(__MOODLE_URL__);
});

afterAll(async () => {
    await browser.close();
});

export { page };
