import {RestClientConfig}                                 from "../../../config/RestClientConfig";
import {UsesAbilities}                                              from "../../Actor";
import {Interaction}                                                from "../../lib/actions/Activities";
import {stepDetails}                                                from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                              from "../abilities/UseTheRestApi";
import {SppRestRequest}                                             from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, saveResponse, SaveToFn} from "./0_helper";

export class Get implements Interaction, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private saveTo: (result: any) => void;
    private catchError =  false;
    private config: RestClientConfig | undefined;

    @stepDetails<UsesAbilities>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseTheRestApi.as(actor).send(this.request).get(this.config)
            .then(saveResponse(this.saveTo))
            .catch(catchAndSaveOnError(this.saveTo)(this.catchError))
    }


    public static from(request: SppRestRequest): Get {
        return new Get(request);
    }

    public withConfig(config: RestClientConfig) {
        this.config = config;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(saveTo: SaveToFn): Get {
        this.saveTo = saveTo;
        return this;
    }

    public dontFailInCaseOfAnError(): Get {
        this.catchError = true;
        return this;
    }


    private constructor(private request: SppRestRequest) {
    }
}