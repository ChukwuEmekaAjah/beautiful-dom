import HTMLElementData from './htmlelement';
import {RegExpObject, Pattern, tag} from './types';

class BeautifulDom {
    
    private patterns : Pattern[] =  [
        {
            regExp : /\*/,
            action : (match : RegExpMatchArray, tokens : string []) => {
                tokens.push(match[0]);
                let holder : HTMLElementData [] = [];
                if(this.parsedData.length){
                    this.parsedData.forEach((htmlElement) =>{
                        holder =  holder.concat(htmlElement.parseAllTags());
                     });
                     let returnValue : HTMLElementData [] = [];
                     let scrapData : string [] = [];
                     returnValue = holder.filter((element) => {
                         if(scrapData.indexOf(element.outerHTML) == -1){
                             scrapData.push(element.outerHTML);
                             return true;
                         }
                     })
                     this.parsedData = returnValue;
                     return this.parsedData;
                }
                let returnValue = this.parseAllTags();
                this.done = false;
                return returnValue;
            }
        },
        {
            regExp : /(\w+)(\.|#)(\w+)/,
            action : (match:RegExpMatchArray, tokens : string []) => {
                
                if(tokens[tokens.length - 1] == '+'){
                       
                    let htmlElements : HTMLElementData [] = this.parsedData;
                    let allElements : HTMLElementData [] = this.parseAllTags();
                    this.parsedData = htmlElements;
                    let returnValue : HTMLElementData [] = [];
                    let secondSiblingRegExp = this.createTagRegExp(match[1]);
                    let secondSiblingMatch : RegExpMatchArray | null;
                    let scrapData : string [] = [];
                    for(let u = 0; u < allElements.length; u++){

                        for(let element = 0; element < htmlElements.length; element++){
                            let breakingCondition : Boolean = false;
                            if(allElements[u].outerHTML == htmlElements[element].outerHTML){
                                for(let x = u+1; x < allElements.length; x++){
                                    if(htmlElements[element].outerHTML.indexOf(allElements[x].outerHTML) > -1){
                                        continue;
                                    }
                                    else if( !(secondSiblingMatch = allElements[x].outerHTML.
                                        slice(allElements[x].outerHTML.
                                        indexOf('<'),allElements[x].outerHTML.
                                        indexOf('>')+1).match(secondSiblingRegExp.openingRegExp))){
                                        break;
                                    }
                                    else if(secondSiblingMatch = allElements[x].outerHTML.
                                        slice(allElements[x].outerHTML.
                                        indexOf('<'),allElements[x].outerHTML.
                                        indexOf('>')+1).match(secondSiblingRegExp.openingRegExp)){
                                            if(scrapData.indexOf(allElements[x]['outerHTML']) == -1){
                                                scrapData.push(allElements[x].outerHTML);
                                                returnValue.push(allElements[x]);
                                                breakingCondition = true;
                                                u = x;
                                                break;
                                            }  
                                    }
                                }
                            }
                            if(breakingCondition){
                                break;
                            }
                        }
                    }
                    this.parsedData = returnValue;
                }
                else if(tokens[tokens.length - 1] == '>'){
                       
                    let matchingTags : HTMLElementData [] = [];
                    let scrapData : string [] = [];
                    for(let element = 0; element < this.parsedData.length; element++){
                        let matchingElements = this.parsedData[element].getElementsByTagName(match[1]);
                        for (let matchingElement of matchingElements){
                            let i:number;
                            for(i = element + 1; i < this.parsedData.length; i++){
                                if(this.parsedData[i].outerHTML.indexOf(matchingElement.outerHTML) > - 1){ 
                                    // if it is in any of the other possible parents
                                    
                                    break;
                                }
                            }
                            if(i == this.parsedData.length){
                                   
                                // that means it is not in any of the other matchingTags
                                if(scrapData.length > 0){
                                    let u = 0;
                                    for(; u < scrapData.length; u++){
                                        if(scrapData[u].indexOf(matchingElement.outerHTML) > - 1){
                                            break;
                                        }
                                        else if(u == scrapData.length -1 && scrapData[u].indexOf(matchingElement.outerHTML) == - 1 ){
                                            scrapData.push(matchingElement.outerHTML);
                                            matchingTags.push(matchingElement);
                                               
                                        }
                                    }
                                } else{
                                    scrapData.push(matchingElement.outerHTML);
                                    matchingTags.push(matchingElement);
                                }
                            }
                        }
                    }
                    this.parsedData = matchingTags;
                }
                else{
                    let holder : HTMLElementData [] = [];
                    if(this.parsedData.length > 0){
                        this.parsedData.forEach((htmlElement) =>{
                            holder =  holder.concat(htmlElement.getElementsByTagName(match[1]));
                        });
                        let returnValue : HTMLElementData [] = [];
                        let scrapData : string[] = [];
                        returnValue = holder.filter((element) => {
                            if(scrapData.indexOf(element.outerHTML) == -1){
                                scrapData.push(element.outerHTML);
                                return true;
                            }
                        })
                        this.parsedData = returnValue;
                    }else{
                        this.getElementsByTagName(match[1]);
                    }
                }
                tokens.push(match[0]);
                let attributeRegExp : RegExp;
                if(match[2] == '.'){
                     attributeRegExp  = new RegExp(`\\s+class\\s*=\\s*('|").*?${match[3]}.*?("|')`, 'm');
                } else if (match[2] == '#') {
                     attributeRegExp  = new RegExp(`\\s+id\\s*=\\s*('|").*?${match[3]}.*?("|')`, 'm');
                }
                
                let returnValue = this.parsedData.filter((element) => {
                    if(element.outerHTML.slice(element.outerHTML.indexOf('<'), element.outerHTML.indexOf('>')).match(attributeRegExp)){
                        return true;
                    }
                });
                this.parsedData = returnValue;
                this.done = false;
                return this.parsedData;
            }
        },
        {
            regExp : /(\w+)/,
            action : (match:RegExpMatchArray, tokens : string []) => {
                if(tokens[tokens.length - 1] == '+'){
                    tokens.push(match[0])
                       
                    let htmlElements : HTMLElementData [] = this.parsedData;
                    let allElements : HTMLElementData [] = this.parseAllTags();
                    this.parsedData = htmlElements;
                    let returnValue : HTMLElementData [] = [];
                    let secondSiblingRegExp = this.createTagRegExp(match[1]);
                    let secondSiblingMatch : RegExpMatchArray | null;
                    let scrapData : string [] = [];
                    for(let u = 0; u < allElements.length; u++){

                        for(let element = 0; element < htmlElements.length; element++){
                            let breakingCondition : Boolean = false;
                            if(allElements[u].outerHTML == htmlElements[element].outerHTML){
                                for(let x = u+1; x < allElements.length; x++){
                                    if(htmlElements[element].outerHTML.indexOf(allElements[x].outerHTML) > -1){
                                        continue;
                                    }
                                    else if( !(secondSiblingMatch = allElements[x].outerHTML.
                                        slice(allElements[x].outerHTML.
                                        indexOf('<'),allElements[x].outerHTML.
                                        indexOf('>')+1).match(secondSiblingRegExp.openingRegExp))){
                                        break;
                                    }
                                    else if(secondSiblingMatch = allElements[x].outerHTML.
                                        slice(allElements[x].outerHTML.
                                        indexOf('<'),allElements[x].outerHTML.
                                        indexOf('>')+1).match(secondSiblingRegExp.openingRegExp)){
                                            if(scrapData.indexOf(allElements[x]['outerHTML']) == -1){
                                                scrapData.push(allElements[x].outerHTML);
                                                returnValue.push(allElements[x]);
                                                breakingCondition = true;
                                                break;
                                            }  
                                    }
                                }
                            }
                            if(breakingCondition){
                                break;
                            }
                        }
                    }
                    this.parsedData = returnValue;
                    this.done = false;
                    return this.parsedData;
                }
                else if(tokens[tokens.length - 1] == '>'){
                       
                    let matchingTags : HTMLElementData [] = [];
                    let scrapData : string [] = [];
                    for(let element = 0; element < this.parsedData.length; element++){
                        let matchingElements = this.parsedData[element].getElementsByTagName(match[1]);
                        for (let matchingElement of matchingElements){
                            let i:number;
                            for(i = element + 1; i < this.parsedData.length; i++){
                                if(this.parsedData[i].outerHTML.indexOf(matchingElement.outerHTML) > - 1){ 
                                    // if it is in any of the other possible parents
                                    
                                    break;
                                }
                            }
                            if(i == this.parsedData.length){
                                   
                                // that means it is not in any of the other matchingTags
                                if(scrapData.length > 0){
                                    let u = 0;
                                    for(; u < scrapData.length; u++){
                                        if(scrapData[u].indexOf(matchingElement.outerHTML) > - 1){
                                            break;
                                        }
                                        else if(u == scrapData.length -1 && scrapData[u].indexOf(matchingElement.outerHTML) == - 1 ){
                                            scrapData.push(matchingElement.outerHTML);
                                            matchingTags.push(matchingElement);
                                               
                                        }
                                    }
                                } else{
                                    scrapData.push(matchingElement.outerHTML);
                                    matchingTags.push(matchingElement);
                                }
                            }
                        }
                    }
                    this.parsedData = matchingTags;
                    this.done = false;
                    return this.parsedData
                }
                tokens.push(match[0]);
                let holder : HTMLElementData [] = [];
                if(this.parsedData.length > 0){
                    this.parsedData.forEach((htmlElement) =>{
                       holder =  holder.concat(htmlElement.getElementsByTagName(match[0]));
                    });
                    let returnValue : HTMLElementData [] = [];
                    let scrapData : string[] = [];
                    returnValue = holder.filter((element) => {
                        if(scrapData.indexOf(element.outerHTML) == -1){
                            scrapData.push(element.outerHTML);
                            return true;
                        }
                    })
                    this.parsedData = returnValue;
                    this.done = false;
                    return this.parsedData;
                }else{
                    let returnValue = this.getElementsByTagName(match[0]);
                    this.done = false;
                    return returnValue;
                }
            }
        },
        {
            regExp : /\.(\w+)/,
            action : (match:RegExpMatchArray, tokens : string [], elements : HTMLElementData []) => {
                if(tokens[tokens.length - 1] == '+'){
                    tokens.push(match[0])
                    let htmlElements : HTMLElementData [] = this.parsedData;
                    let allElements : HTMLElementData [] = this.parseAllTags();
                    this.parsedData = htmlElements;
                    let returnValue : HTMLElementData [] = [];
                    let secondSiblingRegExp = this.createTagRegExp(match[1]);
                    let secondSiblingMatch : RegExpMatchArray | null;
                    let scrapData : string [] = [];
                    let attributeRegExp  = new RegExp(`\\s+class\\s*=\\s*('|").*?${match[1]}.*?("|')`, 'm');
                    for(let u = 0; u < allElements.length; u++){

                        for(let element = 0; element < htmlElements.length; element++){
                            let breakingCondition : Boolean = false;
                            if(allElements[u].outerHTML == htmlElements[element].outerHTML){
                                for(let x = u+1; x < allElements.length; x++){
                                    if(htmlElements[element].outerHTML.indexOf(allElements[x].outerHTML) > -1){
                                        continue;
                                    }
                                    else if( !(secondSiblingMatch = allElements[x].outerHTML.
                                        slice(allElements[x].outerHTML.
                                        indexOf('<'),allElements[x].outerHTML.
                                        indexOf('>')+1).match(attributeRegExp))){
                                        break;
                                    }
                                    else if(secondSiblingMatch = allElements[x].outerHTML.
                                        slice(allElements[x].outerHTML.
                                        indexOf('<'),allElements[x].outerHTML.
                                        indexOf('>')+1).match(attributeRegExp)){
                                            if(scrapData.indexOf(allElements[x]['outerHTML']) == -1){
                                                scrapData.push(allElements[x].outerHTML);
                                                returnValue.push(allElements[x]);
                                                breakingCondition = true;
                                                break;
                                            }  
                                    }
                                }
                            }
                            if(breakingCondition){
                                break;
                            }
                        }
                    }
                    this.parsedData = returnValue;
                    this.done = false;
                    return this.parsedData;
                }
                else if(tokens[tokens.length - 1] == '>'){
                    let matchingTags : HTMLElementData [] = [];
                    let scrapData : string [] = [];
                    for(let element = 0; element < this.parsedData.length; element++){
                        let matchingElements = this.parsedData[element].getElementsByClassName(match[1]);
                        for (let matchingElement of matchingElements){
                            let i:number;
                            for(i = element + 1; i < this.parsedData.length; i++){
                                if(this.parsedData[i].outerHTML.indexOf(matchingElement.outerHTML) > - 1){ 
                                    // if it is in any of the other possible parents
                                    
                                    break;
                                }
                            }
                            if(i == this.parsedData.length){
                                   
                                // that means it is not in any of the other matchingTags
                                if(scrapData.length > 0){
                                    let u = 0;
                                    for(; u < scrapData.length; u++){
                                        if(scrapData[u].indexOf(matchingElement.outerHTML) > - 1){
                                            break;
                                        }
                                        else if(u == scrapData.length -1 && scrapData[u].indexOf(matchingElement.outerHTML) == - 1 ){
                                            scrapData.push(matchingElement.outerHTML);
                                            matchingTags.push(matchingElement);
                                        }
                                    }
                                } else{
                                    scrapData.push(matchingElement.outerHTML);
                                    matchingTags.push(matchingElement);
                                }
                            }
                        }
                    }
                    this.parsedData = matchingTags;
                    this.done = false;
                    return this.parsedData;
                }
                let holder : HTMLElementData [] = [];
                if(this.parsedData.length > 0){
                    this.parsedData.forEach((htmlElement) =>{
                       holder =  holder.concat(htmlElement.getElementsByClassName(match[0].slice(1)));
                    });
                    let returnValue : HTMLElementData [] = [];
                    let scrapData : string [] = [];
                    returnValue = holder.filter((element) => {
                        if(scrapData.indexOf(element.outerHTML) == -1){
                            scrapData.push(element.outerHTML);
                            return true;
                        }
                    })
                    this.parsedData = returnValue;
                    this.done = false;
                    return this.parsedData;
                }else{
                       
                    let returnValue =  this.getElementsByClassName(match[0].slice(1));
                    this.done = false;
                    return returnValue;
                }
            }
        },
        {
            regExp : /#(\w+)/,
            action : (match:RegExpMatchArray, tokens : string [], elements : HTMLElementData []) => {
                tokens.push(match[0]);
                let returnValue : any [] = [];
                returnValue.push(this.getElementById(match[0].slice(1)))
                this.done = false;
                return returnValue;
            }
        },
        {
            regExp : /\+|>/,
            action : (match:RegExpMatchArray, tokens:string[]) =>{
                tokens.push(match[0]);
                return this.parsedData; 
            }
        },
        {
            regExp : /\[(\w+)(([\^\|\~\$\*])?=?('|")(\w+)('|"))?\]/,
            action : (match:RegExpMatchArray, tokens : string [], elements : HTMLElementData []) => {
                tokens.push(match[0]);
                
                let returnValue = this.getByAttribute(match[1]);
                this.done = false;
                return returnValue;
            }
        },
        
    ];
    
    private data: string;
    private parsedData : HTMLElementData [] = <HTMLElementData []> [];
    private done : Boolean = false;
	constructor(data_source : string){
        if(data_source.length == 0){
            throw new Error("Please input the html document you want to parse");
        }
        if(typeof data_source != 'string'){
            throw new TypeError('Input data must be a string');
        }
        this.data = data_source.toString().split(/\n\r|\n|\r/gmi).join(" ");
    } 

    public reInit(){
        this.parsedData = [];
        return this;
    }
    
    private getAllTags(data:string) : tag [] {
        let tagsRegex : RegExp = /<\s*(\w+)\s*.*?>/mi;
        let match : RegExpMatchArray | null ;
        let startingIndex : number = 0;
        let availableTags : tag [] = [];
        let counter = 0;
        while(match = data.slice(startingIndex).match(tagsRegex)){
            let tagObject = {tag : match[1], index : counter++}
            availableTags.push(tagObject);
            let index = match ? typeof(match['index']) == 'number' ? match['index'] : 0 : 0;
            startingIndex += index + match[0].length;
        }

        console.log("all available tags are ", availableTags);
        return availableTags;
    }

    private createTagRegExp(tagType : string) : RegExpObject{
        let tagRegExp : RegExp = new RegExp(`<\\s*${tagType}\\b.*?>|<\\s*\/${tagType}>`,"mi");
        let openingRegExp : RegExp = new RegExp(`<\\s*${tagType}\\b.*?>`);
        let closingRegExp : RegExp = new RegExp(`<\\s*\/${tagType}>`);

	    return {tagRegExp: tagRegExp, openingRegExp:openingRegExp, closingRegExp: closingRegExp};

    }

    public getElementsByTagName(tag : string){
        let data_copy : string;
        this.parsedData = <HTMLElementData []> [];
        data_copy = this.data.slice(0,);
        let match : RegExpMatchArray | null;
        let matchRegex : RegExpObject = this.createTagRegExp(tag.trim());
        let matches : RegExpMatchArray[] =  [];
        while(match = data_copy.match(matchRegex.tagRegExp)){
            let index : number = match ? typeof (match['index']) == 'number' ? match['index'] : 0  : 0;
            data_copy = data_copy.slice(match[0].length + index,);
            if(matches.length > 0){
                match['index'] = matches[matches.length - 1]['index'] + matches[matches.length - 1][0].length + index;
            }
            matches.push(match);
        }

        for(let i = 0; i < matches.length; i++){
            let openingTag : RegExpMatchArray | null;
            let closingTagsCounter : number = 0;
            let openingTagsCounter : number = 0;
            if(openingTag = matches[i][0].match(matchRegex.openingRegExp)){
                openingTagsCounter += 1;
                for(let u = i+1; u < matches.length; u++){
                    if(matchRegex.openingRegExp.test(matches[u][0])){
                        openingTagsCounter += 1;
                    }
                    if(matchRegex.closingRegExp.test(matches[u][0])){
                        closingTagsCounter += 1;
                    }
                    if(openingTagsCounter == closingTagsCounter){
                        let outerHTML = this.data.slice(matches[i]['index'], matches[u]['index'] + matches[u][0].length);
                        let node_object : HTMLElementData = new HTMLElementData(outerHTML);
                        this.parsedData.push(node_object);
                        break;
                    }
                }
                if(closingTagsCounter == 0){
                    let outerHTML = this.data.slice(matches[i]['index'], matches[i]['index'] + matches[i][0].length);
                    let node_object : HTMLElementData = new HTMLElementData(outerHTML);
                    this.parsedData.push(node_object);
                }
            }
        }
        this.done = true;
        return this.parsedData;
    }

    private parseAllTags(){
        let tags : tag [] = this.getAllTags(this.data);
        let elements : HTMLElementData [] = < HTMLElementData []> [];
        for (let tag of tags){
            // get all the tags in this array that is of this type;
            let relatives = tags.filter((tagData) => {
                if(tagData.tag == tag.tag ){
                    return true;
                }
            });
            let temp  = this.getElementsByTagName(tag.tag)
            temp.forEach((element, index) => {
                elements[relatives[index]['index']] = element;
            })
        }
        this.parsedData = elements;
        return this.parsedData;
    }

    private getByAttribute(attribute : string, attributeValue?:string): HTMLElementData[] {
        let attributeRegExp : RegExp= new RegExp(`${attribute}=\\s*('|")((\\b${attributeValue}\\b.*?)|(.*?\\b${attributeValue}\\b.*?)|(.*?\\b${attributeValue}\\b))("|')`, 'mi');
        let matchingTags : HTMLElementData[] = <HTMLElementData []> [];
        if(this.parsedData.length == 0 || this.done){
            this.parseAllTags();
        }
        for(let i = 0; i < this.parsedData.length; i++){
            let openingTag : string = this.parsedData[i]['outerHTML']
                .slice(this.parsedData[i]['outerHTML']
                .indexOf('<'),this.parsedData[i]['outerHTML']
                .indexOf('>') + 1 );
    
            if(openingTag.match(attributeRegExp)){
                matchingTags.push(this.parsedData[i]);
            }
        }
        this.parsedData = matchingTags;
        return matchingTags;
    }

    public getElementsByClassName(classValue:string) : HTMLElementData[]{
        this.done = true;
        return this.getByAttribute('class', classValue.trim());
    }

    public getElementById(id : string) : HTMLElementData | null {
        let matchingElements : HTMLElementData [] = this.getByAttribute( "id", id.trim());
        let element : HTMLElementData | null = matchingElements.length > 0 ? matchingElements[0] : null;
        this.done = true;
        return element;
    }

    public getElementsByName(name : string) : HTMLElementData[] {
        this.done = true;
        return this.getByAttribute( "name", name.trim());
    }

    public querySelectorAll(query : string) : HTMLElementData[] {
        this.parsedData = this.done ? [] : this.parsedData;
        let tokens : string [] = [];
        query = query.trim();
        while(query.length){
            let match : RegExpMatchArray | null;
            for(let pattern of this.patterns){
                if(match = query.match(pattern.regExp)){
                    if(match['index'] == 0){
                        this.parsedData = pattern.action(match, tokens, this.parsedData);
                        query = query.slice(match[0].length).trim();
                        break;
                    }
                    else{
                        continue;
                    }
                }
            }
       }
       this.done = true;
       return this.parsedData;
    }

    public querySelector(query : string) : (HTMLElementData | null) {
        let returnValue =  this.querySelectorAll(query).slice(0,1)[0] ?this.querySelectorAll(query).slice(0,1)[0] : null;
        this.done = true;
        return returnValue;
    }
}

export default BeautifulDom;