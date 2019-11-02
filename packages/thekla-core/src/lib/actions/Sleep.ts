import {Interaction}   from "./Activities";
import {UsesAbilities} from "../Actor";
import {getLogger}     from "@log4js-node/log4js-api"
import {stepDetails}   from "../decorators/step_decorators";
import {wait}          from "../utils/utils";

export class Sleep implements Interaction<void, void> {
    private logger = getLogger(`Sleep`);
    public sleepReason = ``;

    @stepDetails<UsesAbilities, void, void>(`stop all actions for '<<sleepTime>>' ms<<sleepReason>>`)
    // parameter is needed for stepDetails typing
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public performAs(actor: UsesAbilities): Promise<void> {
        return wait(this.sleepTime).then((): void => {
            return this.logger.trace(`Slept for ${this.sleepTime}`);
        });
    }

    public static for(sleepTime: number): Sleep {
        return new Sleep(sleepTime);
    }

    public because(sleepReason: string): Sleep {
        this.sleepReason = ` because ${sleepReason}`;
        return this;
    }

    private constructor(private sleepTime: number) {
    }

}