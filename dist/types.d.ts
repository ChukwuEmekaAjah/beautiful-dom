export interface RegExpObject {
    tagRegExp: RegExp;
    openingRegExp: RegExp;
    closingRegExp: RegExp;
}
export interface tag {
    tag: string;
    index: number;
}
export interface Pattern {
    regExp: RegExp;
    action: Function;
}
