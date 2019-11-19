import {DidNotFind, FrameElementFinder}         from "../..";
import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";

export interface UntilElementCondition {
    visible: UntilElementCondition;
    enabled: UntilElementCondition;

    forAsLongAs(timeout: number): UntilElementCondition;
    waitFor(elements: WebElementFinder | WebElementListFinder): Promise<void>;

    readonly modifierFunc: LogicFunction<boolean>;
    readonly waiter: ElementCondition;
    readonly timeout: number;
    readonly conditionHelpText: string;
}

/**
 * reduces the status array to a boolean value
 * @param {boolean | boolean[]} status
 * @returns {boolean}
 */
const reduceStatus = (status: boolean | boolean[]): boolean => {
    if (Array.isArray(status))
        return status.reduce((acc: boolean, value: boolean) => value && acc, true);

    return status
};

abstract class ElementCondition {
    public abstract helpText: string;
    public elementText = ``;

    abstract isFulfilledFor(element: WebElementFinder | WebElementListFinder): () => Promise<boolean>;

}

export class VisibilityCheck extends ElementCondition {
    public constructor(
        public modifierFunc: (result: boolean) => boolean,
        public helpText = `visible`
    ) {
        super()
    }

    public isFulfilledFor(element: WebElementFinder | WebElementListFinder): () => Promise<boolean> {
        this.elementText = `Waiting until element called '${element.description}'`;

        return (): Promise<boolean> => {

            return element.isVisible()
                          .then(reduceStatus)
                          .then(this.modifierFunc)
        };
    }
}

export class EnabledCheck extends ElementCondition {
    public constructor(
        public modifierFunc: (result: boolean) => boolean,
        public helpText = `enabled`
    ) {
        super()
    }

    public isFulfilledFor(element: WebElementFinder): () => Promise<boolean> {
        const helpText = `${element.description}`;
        return (): Promise<boolean> => {
            return element.isEnabled()
                          .then(reduceStatus)
                          .then(this.modifierFunc);
        };
    }
}

type LogicFunction<T> = (param: T) => T

export class UntilElement implements UntilElementCondition {
    private _timeout = 5000;
    public waiter: ElementCondition;

    private static readonly id: LogicFunction<boolean> = (result: boolean): boolean => result;
    private static readonly negate: LogicFunction<boolean> = (result: boolean): boolean => !result;

    public static get is(): UntilElement {
        return new UntilElement(UntilElement.id)
    }

    public static get isNot(): UntilElement {
        return new UntilElement(UntilElement.negate)
    }

    public get visible(): UntilElementCondition {
        this.waiter = new VisibilityCheck(this.modifierFunc);
        return this;
    }

    public get enabled(): UntilElementCondition {
        this.waiter = new EnabledCheck(this.modifierFunc);
        return this;
    }

    private constructor(public modifierFunc: LogicFunction<boolean>) {
    }

    public forAsLongAs(timeout: number): UntilElementCondition {
        this._timeout = timeout;
        return this;
    }

    public get timeout(): number {
        return this._timeout;
    }

    public get conditionHelpText(): string {
        return `${this.waiter.elementText} ${this.modifierFunc(true) ? `is` : `is not`} ${this.waiter.helpText}`
    }

    public toString(): string {
        const conditionType = (waiter: ElementCondition): string => {
            if (waiter.constructor.name === `VisibilityCheck`) return `visible`;
            if (waiter.constructor.name === `EnabledCheck`) return `enabled`;
            throw new Error(`ElementCondition named: '${waiter.constructor.name}' not implemented yet. ${(new Error).stack}`)
        };

        return `condition until element is${this.modifierFunc(true) ? `` : ` not`} ${conditionType(this.waiter)}`
    }

    public waitFor(elements: WebElementFinder | WebElementListFinder): Promise<void> {

        const startTime: number = Date.now();

        return new Promise((resolve, reject) => {
            const loop = (): void => {
                const now = Date.now();

                if(now - startTime > this._timeout)
                    reject(DidNotFind.theElement(elements));

                this.waiter.isFulfilledFor(elements)()
                           .then((result: boolean) => {
                               return !result ? setTimeout(loop, 300) : resolve()
                           })
                           .catch(() => setTimeout(loop, 300));
            };

            setTimeout(loop, 300)
        });
    }
}