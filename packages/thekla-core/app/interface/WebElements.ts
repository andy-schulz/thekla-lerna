import {By} from "./Locator";
import {WebElement} from "selenium-webdriver";

export interface WebFinder {
    all(locator: By, description?: string): WebElementListFinder;
    element(locator: By, description?: string): WebElementFinder;
}

export interface WebElementFinder {
    click(): Promise<void>;
    sendKeys(keySequence: string): Promise<void>;
    getDescription(): string;
}

export interface WebElementListFinder extends WebFinder{
}

export interface WdElement extends  WebElement {}