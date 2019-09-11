import {ActivityLogNode}                from "../../../packages/ActivityLog/ActivityLogEntry";
import {encodeLog, formatLogWithPrefix} from "../../../packages/ActivityLog/format_log";

describe(`Using the log formater`, (): void => {

    describe(`with a single log node`, (): void => {

        it(`should create a single log message line 
        - (test case id: c5228ece-d1aa-4e0a-8f4b-696009fc786c)`, (): void => {
            const log: ActivityLogNode = {
                name: `1`,
                description: `A`,
                activityNodes: [],
            };

            expect(formatLogWithPrefix(``)(0)(log)).toEqual(`[1] - A`);
            expect(formatLogWithPrefix(`\t`)(1)(log)).toEqual(`\t[1] - A`);
            expect(formatLogWithPrefix(`\t`)(2)(log)).toEqual(`\t\t[1] - A`);
        });
    });

    describe(`with a hierarchical log tree`, (): void => {

        it(`should create a hierarchical log string
        - (test case id: c5228ece-d1aa-4e0a-8f4b-696009fc786c)`, (): void => {
            const log: ActivityLogNode = {
                name: `1`,
                description: `A`,
                activityNodes: [
                    {
                        name: `2`,
                        description: `B`,
                        activityNodes: [
                            {
                                name: `3`,
                                description: `C`,
                                activityNodes: [
                                    {
                                        name: `4`,
                                        description: `D`,
                                        activityNodes: [],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            };

            expect(formatLogWithPrefix(``)( 0)(log)).toEqual(`[1] - A\n[2] - B\n[3] - C\n[4] - D`);
            expect(formatLogWithPrefix(`\t`)( 1)(log)).toEqual(`\t[1] - A\n\t\t[2] - B\n\t\t\t[3] - C\n\t\t\t\t[4] - D`);
            expect(formatLogWithPrefix(`\t`)( 2)(log)).toEqual(`\t\t[1] - A\n\t\t\t[2] - B\n\t\t\t\t[3] - C\n\t\t\t\t\t[4] - D`);
        });
    });

    describe(`to encode a string`, (): void => {

        const testString = `MyString`;

        it(`should return a base64 string when the encoding is set 
        - (test case id: bdad05f3-4e3a-468b-af31-69f1ad395abf)`, (): void => {
            expect(encodeLog(`base64`)(`MyString`)).toEqual(new Buffer(testString).toString(`base64`))
        });

        it(`should return the string if no encoding is set 
        - (test case id: 29b4c4ca-511e-4d49-ada3-cc94152da617)`, (): void => {
            expect(encodeLog(``)(testString)).toEqual(testString);
        });

        it(`should return the string if no encoding is set (undefined)
        - (test case id: 29b4c4ca-511e-4d49-ada3-cc94152da617)`, (): void => {
            expect(encodeLog()(testString)).toEqual(testString);
        });
    });
});