import HTMLElementData from './htmlelement';
declare class BeautifulDom {
    private patterns;
    private data;
    private parsedData;
    constructor(data_source: string);
    reInit(): this;
    private getAllTags;
    private createTagRegExp;
    getElementsByTagName(tag: string): HTMLElementData[];
    private parseAllTags;
    private getByAttribute;
    getElementsByClassName(classValue: string): HTMLElementData[];
    getElementById(id: string): HTMLElementData | null;
    getElementsByName(name: string): HTMLElementData[];
    querySelectorAll(query: string): HTMLElementData[];
    querySelector(query: string): HTMLElementData;
}
export default BeautifulDom;
