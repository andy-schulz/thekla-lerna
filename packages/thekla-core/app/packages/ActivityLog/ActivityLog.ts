import {ActivityLogEntry, ActivityLogEntryType, ActivityLogNode} from "./ActivityLogEntry";
import {formatLogWithPrefix}                                     from "./format_log";

export class ActivityLog {
    private readonly rootActivityLogEntry: ActivityLogEntry;
    private _currentActivity: ActivityLogEntry;

    public addActivityLogEntry(
        activityName: string,
        activityDescription: string,
        activityType: ActivityLogEntryType): ActivityLogEntry {
        const logEntry = new ActivityLogEntry(activityName, activityDescription, activityType, this._currentActivity);
        this._currentActivity.addActivityLogEntry(logEntry);
        this._currentActivity = logEntry;

        return logEntry;

    }

    public reset(entry: ActivityLogEntry): void {
        if(entry.parent)
            this._currentActivity = entry.parent;
    }

    public getLogTree(): ActivityLogNode {
        return this.rootActivityLogEntry.getLogTree();
    }

    public getStructuredLog(logPrefix: string = `    `): string {
        const logTree = this.rootActivityLogEntry.getLogTree();
        return formatLogWithPrefix(`${logPrefix}`, 0, logTree)
    };

    // public getStructuredLog(): string {
    //     return this.rootActivityLogEntry.getStructuredLog();
    // }

    public constructor(name: string) {
        this._currentActivity = new ActivityLogEntry(
            `START`,
            `${name} starts Testing`,
            `Task`,
            null);

        this.rootActivityLogEntry = this._currentActivity
    }
}