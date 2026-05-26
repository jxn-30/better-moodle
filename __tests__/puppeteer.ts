import * as ghCore from '@actions/core';
import chalk from 'chalk';
import { Downloader } from 'nodejs-file-downloader';
import { isCI } from 'ci-info';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { PUPPETEER_REVISIONS } from 'puppeteer-core/internal/revisions.js';
import { tmpdir } from 'node:os';
import unzip from '@tomjs/unzip-crx';
import { afterAll, beforeAll, expect, inject, vi } from 'vitest';
import puppeteer, { type Browser, type Page } from 'puppeteer';

/**
 * Downloads an extension from the chrome webstore and unpacks it
 * @param id - the extension id
 * @returns a promise that resolves to the directory where the unpacked extension lives in
 */
const downloadExtension = async (id: string) => {
    const downloadUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${PUPPETEER_REVISIONS.chrome}&acceptformat=crx2,crx3&x=id%3D${id}%26uc`;
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
let tampermonkeyID: string | undefined;

const userDataDir = await mkdtemp(join(tmpdir(), 'profile-'));

/**
 * Launches a browser and enables closing all unwanted tabs
 * @returns the launched browser instance
 */
const launchBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: isCI,
        userDataDir,
        slowMo: 100,
        args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : undefined, // no sandbox can be used on Github runners
        enableExtensions: true,
        pipe: true,
        // dumpio: true,
    });

    console.debug('Launched a Browser!');

    tampermonkeyID = await browser.installExtension(tampermonkeyDir);

    console.debug(`Installed Tampermenkey (ID: ${tampermonkeyID})`);

    // if any unwanted page appears, close it
    void browser.on('targetcreated', target => {
        if (
            target.url().startsWith(__MOODLE_URL__) ||
            target.url().startsWith('chrome://') ||
            target.url().startsWith('chrome-extension://') ||
            target.url().startsWith('devtools://') ||
            target.url() === 'about:blank'
        ) {
            return;
        }

        void target.page().then(page => page?.close());
    });

    return browser;
};

/**
 * Inits a browser by launching it, enabling dev mode and allowing tampermonkey to execute userscripts
 * @returns the browser instance
 */
const initBrowser = async () => {
    const browser = await launchBrowser();

    // enable developer mode and find tampermonkey extension-ID
    const devmodePage = await browser.newPage();
    await devmodePage.goto('chrome://extensions/');
    await devmodePage.click('body >>> #devMode');

    // allow tampermonkey to run userscripts
    await devmodePage.goto(`chrome://extensions/?id=${tampermonkeyID}`);
    await devmodePage
        .locator('body >>> extensions-toggle-row#allow-user-scripts')
        .click();

    await devmodePage.close();

    console.debug('Enabled userscripts in chromium.');

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

    console.debug('Successfully installed Better-Moodle!');

    // if we don't do this, the script seems not to be installed correctly? 🤷
    await browser
        .newPage()
        .then(page =>
            page.goto(`chrome-extension://${tampermonkeyID}/options.html`)
        );

    return browser;
};

const pageErrorOccured = vi.fn();

beforeAll(async () => {
    console.time('beforeAll');
    // initialising the browser
    // reopening was required before but since tampermonkey 5.5.0, this is not needed anymore plus it may cause weird issues.
    browser = await initBrowser();
    console.debug('Browser initialised and opened');
    console.timeLog('beforeAll');

    // create a new page for the Moodle
    page = await browser.newPage();

    // report errors on the page
    page.on('pageerror', err => {
        if (
            err instanceof Error &&
            err.stack?.includes(
                `chrome-extension://${tampermonkeyID}/userscript.html`
            )
        ) {
            ghCore.error(`❌ ${err.message} ${chalk.dim(`@ ${page.url()}`)}`);
            console.error(err);
            pageErrorOccured();
        }
    });

    // report some console outputs
    page.on('console', msg => {
        if (
            !msg
                .stackTrace()
                .some(({ url }) =>
                    url?.startsWith(
                        `chrome-extension://${tampermonkeyID}/userscript.html`
                    )
                )
        ) {
            return;
        }

        // logging in a Format that is a GitHub annotation
        let msgEmoji;
        switch (msg.type()) {
            case 'warn':
                msgEmoji = '⚠️';
                ghCore.warning(`${msg.text()} ${chalk.dim(`@ ${page.url()}`)}`);
                break;
            case 'error':
                msgEmoji = '❌';
                ghCore.error(`${msg.text()} ${chalk.dim(`@ ${page.url()}`)}`);
                break;
            case 'info':
                msgEmoji = 'ℹ️';
                ghCore.notice(`${msg.text()} ${chalk.dim(`@ ${page.url()}`)}`);
                break;
        }

        if (msgEmoji) {
            console.log(
                `
${msgEmoji} ${chalk.bold('URL')}: ${page.url()}
${msgEmoji} ${chalk.bold('MSG')}: ${msg.text()}
`.trim()
            );
            console.table(msg.stackTrace());
        }
    });

    // now open the moodle page
    await page.goto(__MOODLE_URL__);

    console.debug(`Opened the Moodle page: ${__MOODLE_URL__}`);
    console.timeEnd('beforeAll');
});

afterAll(async () => {
    expect(pageErrorOccured).not.toHaveBeenCalled();
    await browser.close();
});

export { page };
