declare class HTMLElementData {
    outerHTML: string;
    innerHTML: string;
    innerText: string;
    textContent: string;
    parsedData: HTMLElementData[];
    private patterns;
    constructor(outerHTML: string);
    private getAllTags;
    private createTagRegExp;
    getElementsByTagName(tag: string): HTMLElementData[];
    parseAllTags(): HTMLElementData[];
    private getByAttribute;
    getElementsByClassName(classValue: string): HTMLElementData[];
    querySelectorAll(query: string): HTMLElementData[];
    querySelector(query: string): HTMLElementData;
    getAttribute(attribute: string): (string | null);
}
export default HTMLElementData;
