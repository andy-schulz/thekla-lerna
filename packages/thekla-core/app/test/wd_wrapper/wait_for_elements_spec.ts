import {
    Browser, WebElementFinder, By, UntilElement, SeleniumConfig, DesiredCapabilities
} from "../..";
import {configure}   from "log4js";
import {BrowserWdjs} from "../../driver/wdjs/BrowserWdjs";

configure(`res/config/log4js.json`);

const conf: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `https://teststepsframeworktester.azurewebsites.net`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
    proxy: {
        type: `direct`
    }
};


describe(`Waiting for WD Elements`, (): void => {
    let browser: Browser;
    let appearButton5000ShallWait: WebElementFinder;

    afterAll((): Promise<void[]> => {
        return BrowserWdjs.cleanup();
    });

    beforeAll((): void => {
        browser = BrowserWdjs.create(conf, capabilities);
    },20000);

    describe(`and try to implicitly wait for an Element`,(): void => {

        it(`the system should wait for a second 
        - (test case id: d106ba43-542c-44c7-959e-f64dcdc6943d)`, async (): Promise<void> => {
            appearButton5000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy5000']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(1000));

            await browser.get(`/delayed`);
            expect(await appearButton5000ShallWait.isVisible()).toEqual(false)
        }, 20000);

        it(`the system should wait for a second 
        - (test case id: 2af14d42-6f9d-4532-a151-c4d4390c352e)`, async (): Promise<void> => {
            appearButton5000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy5000']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(5000));

            await browser.get(`/delayed`);
            expect(await appearButton5000ShallWait.isVisible()).toEqual(true)
        }, 20000);

        it(`the system should wait for element after redirect 
        - (test case id: a86b8f45-9706-40ab-bdd2-a5319cde0d0f)`, async (): Promise<void> => {
            appearButton5000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy5000']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(11000));

            await browser.get(`/redirect`);
            expect(await appearButton5000ShallWait.isVisible()).toEqual(true)
        }, 20000);
    });

    describe(`which are chained by xpath`, (): void => {
        it(`should find the element after 5 Seconds 
        - (test case id: 958da8f9-82eb-465c-ace8-bb4496f8f77b)`, async () => {
            const appearRow = browser.element(By.xpath(`//*[@data-test-id='appear']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(11000));

            const appearCol1 = appearRow.element(By.xpath(`.//*[@data-test-id='appearCol1']`));

            const button = appearCol1.element(By.xpath(`.//button`))
                .shallWait(UntilElement.is.visible().forAsLongAs(10000));

            await browser.get(`/delayed`);
            expect(await button.isVisible()).toEqual(true)

        });
    });
});