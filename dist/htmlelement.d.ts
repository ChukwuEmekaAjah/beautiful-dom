declare class HTMLElementData {
    outerHTML: string;
    innerHTML: string;
    innerText: string;
    textContent: string;
    private done;
    parsedData: HTMLElementData[];
    private patterns;
    constructor(outerHTML: string);
    getStatus(): Boolean;
    private getAllTags;
    private createTagRegExp;
    getElementsByTagName(tag: string): HTMLElementData[];
    parseAllTags(): HTMLElementData[];
    private getByAttribute;
    getElementsByClassName(classValue: string): HTMLElementData[];
    querySelectorAll(query: string): HTMLElementData[];
    querySelector(query: string): (HTMLElementData | null);
    getAttribute(attribute: string): (string | null);
}
export default HTMLElementData;
