import {LogLevel}             from "../../../config/ServerConfig";
import {
    Actor,
    BrowseTheWeb,
    RunningBrowser,
    Enter,
    Navigate,
    See,
    Key,
    Text,
    ServerConfig,
    UntilElement, Wait, DesiredCapabilities, Expected
}                             from "../../../index";
import {GoogleSearch}         from "../../page_objects/GoogleSearch/GoogleSearch";
import {Add}                  from "../../page_objects/GoogleCalculator/Add";
import {GoogleCalculator}     from "../../page_objects/GoogleCalculator/GoogleCalculator";
import {getLogger, configure} from "log4js";
configure(`res/config/log4js.json`);

const logger = getLogger(`Actor`);

describe(`Searching on Google`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    let config: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `warn`) as LogLevel
        },
        serverAddress: {
            hostname: `localhost`
        },
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
    };

    let John: Actor;
    logger.trace(`actor_spec stated`);

    beforeAll((): void => {
        John = Actor.named(`John`);
        John.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withCapabilities(capabilities)));
    });

    it(`for calculator should show the Google calculator ` +
        `- (test case id: 1761a239-3e50-408a-8e5e-1e4e6e6f07c2)`, (): Promise<void> => {

        return John.attemptsTo(
            Navigate.to(`https://www.google.de`),
            Enter.value(`calculator`).into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Wait.for(GoogleCalculator.input).andCheck(UntilElement.is.visible()),
            Add.number(1).to(5),
            See.if(Text.of(GoogleCalculator.input)).is(Expected.toEqual(`6`)),
        );

    }, 20000);

    afterAll((): Promise<void[][]> => {
        return  RunningBrowser.cleanup();
    })
});