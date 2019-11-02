import {RestClientConfig}                                           from "@thekla/config";
import {RestRequestResult}                                          from "../../interface/RestRequestResult";
import {UsesAbilities, Interaction, stepDetails}                    from "@thekla/core";
import {SppRestRequest}                                             from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, saveResponse, SaveToFn} from "./0_helper";
import {UseTheRestApi}                                              from "../abilities/UseTheRestApi";

export class Get implements Interaction<void, RestRequestResult>, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private saveTo: (result: any) => void;
    private catchError = false;
    private config: RestClientConfig | undefined;

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).get(this.config)
            .then(saveResponse(this.saveTo))
            .catch(catchAndSaveOnError(this.saveTo)(this.catchError))
    }

    public static from(request: SppRestRequest): Get {
        return new Get(request);
    }

    public withConfig(config: RestClientConfig): Get {
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