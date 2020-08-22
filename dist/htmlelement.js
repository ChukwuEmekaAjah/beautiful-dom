"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTMLElementData = /** @class */ (function () {
    function HTMLElementData(outerHTML) {
        var _this = this;
        this.done = true;
        this.parsedData = [];
        this.patterns = [
            {
                regExp: /\*/,
                action: function (match, tokens) {
                    tokens.push(match[0]);
                    var holder = [];
                    if (_this.parsedData.length) {
                        _this.parsedData.forEach(function (htmlElement) {
                            holder = holder.concat(htmlElement.parseAllTags());
                        });
                        var returnValue = [];
                        var scrapData_1 = [];
                        returnValue = holder.filter(function (element) {
                            if (scrapData_1.indexOf(element.outerHTML) == -1) {
                                scrapData_1.push(element.outerHTML);
                                return true;
                            }
                        });
                        _this.parsedData = returnValue;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    _this.done = false;
                    return _this.parseAllTags();
                }
            },
            {
                regExp: /(\w+)(\.|#)(\w+)/,
                action: function (match, tokens) {
                    if (tokens[tokens.length - 1] == '+') {
                        var htmlElements = _this.parsedData;
                        var allElements = _this.parseAllTags();
                        _this.parsedData = htmlElements;
                        var returnValue_1 = [];
                        var secondSiblingRegExp = _this.createTagRegExp(match[1]);
                        var secondSiblingMatch = void 0;
                        var scrapData = [];
                        for (var u = 0; u < allElements.length; u++) {
                            for (var element = 0; element < htmlElements.length; element++) {
                                var breakingCondition = false;
                                if (allElements[u].outerHTML == htmlElements[element].outerHTML) {
                                    for (var x = u + 1; x < allElements.length; x++) {
                                        if (htmlElements[element].outerHTML.indexOf(allElements[x].outerHTML) > -1) {
                                            continue;
                                        }
                                        else if (!(secondSiblingMatch = allElements[x].outerHTML.
                                            slice(allElements[x].outerHTML.
                                            indexOf('<'), allElements[x].outerHTML.
                                            indexOf('>') + 1).match(secondSiblingRegExp.openingRegExp))) {
                                            break;
                                        }
                                        else if (secondSiblingMatch = allElements[x].outerHTML.
                                            slice(allElements[x].outerHTML.
                                            indexOf('<'), allElements[x].outerHTML.
                                            indexOf('>') + 1).match(secondSiblingRegExp.openingRegExp)) {
                                            if (scrapData.indexOf(allElements[x]['outerHTML']) == -1) {
                                                scrapData.push(allElements[x].outerHTML);
                                                returnValue_1.push(allElements[x]);
                                                breakingCondition = true;
                                                u = x;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (breakingCondition) {
                                    break;
                                }
                            }
                        }
                        _this.done = false;
                        _this.parsedData = returnValue_1;
                    }
                    else if (tokens[tokens.length - 1] == '>') {
                        var matchingTags = [];
                        var scrapData = [];
                        for (var element = 0; element < _this.parsedData.length; element++) {
                            var matchingElements = _this.parsedData[element].getElementsByTagName(match[1]);
                            for (var _i = 0, matchingElements_1 = matchingElements; _i < matchingElements_1.length; _i++) {
                                var matchingElement = matchingElements_1[_i];
                                var i = void 0;
                                for (i = element + 1; i < _this.parsedData.length; i++) {
                                    if (_this.parsedData[i].outerHTML.indexOf(matchingElement.outerHTML) > -1) {
                                        // if it is in any of the other possible parents
                                        break;
                                    }
                                }
                                if (i == _this.parsedData.length) {
                                    // that means it is not in any of the other matchingTags
                                    if (scrapData.length > 0) {
                                        var u = 0;
                                        for (; u < scrapData.length; u++) {
                                            if (scrapData[u].indexOf(matchingElement.outerHTML) > -1) {
                                                break;
                                            }
                                            else if (u == scrapData.length - 1 && scrapData[u].indexOf(matchingElement.outerHTML) == -1) {
                                                scrapData.push(matchingElement.outerHTML);
                                                matchingTags.push(matchingElement);
                                            }
                                        }
                                    }
                                    else {
                                        scrapData.push(matchingElement.outerHTML);
                                        matchingTags.push(matchingElement);
                                    }
                                }
                            }
                        }
                        _this.parsedData = matchingTags;
                    }
                    else {
                        var holder_1 = [];
                        if (_this.parsedData.length > 0) {
                            _this.parsedData.forEach(function (htmlElement) {
                                holder_1 = holder_1.concat(htmlElement.getElementsByTagName(match[1]));
                            });
                            var returnValue_2 = [];
                            var scrapData_2 = [];
                            returnValue_2 = holder_1.filter(function (element) {
                                if (scrapData_2.indexOf(element.outerHTML) == -1) {
                                    scrapData_2.push(element.outerHTML);
                                    return true;
                                }
                            });
                            _this.parsedData = returnValue_2;
                        }
                        else {
                            _this.getElementsByTagName(match[1]);
                        }
                    }
                    tokens.push(match[0]);
                    var attributeRegExp;
                    if (match[2] == '.') {
                        attributeRegExp = new RegExp("\\s+class\\s*=\\s*('|\").*?" + match[3] + ".*?(\"|')", 'm');
                    }
                    else if (match[2] == '#') {
                        attributeRegExp = new RegExp("\\s+id\\s*=\\s*('|\").*?" + match[3] + ".*?(\"|')", 'm');
                    }
                    var returnValue = _this.parsedData.filter(function (element) {
                        if (element.outerHTML.slice(element.outerHTML.indexOf('<'), element.outerHTML.indexOf('>')).match(attributeRegExp)) {
                            return true;
                        }
                    });
                    _this.parsedData = returnValue;
                    _this.done = false;
                    return _this.parsedData;
                }
            },
            {
                regExp: /(\w+)/,
                action: function (match, tokens) {
                    if (tokens[tokens.length - 1] == '+') {
                        tokens.push(match[0]);
                        var htmlElements = _this.parsedData;
                        var allElements = _this.parseAllTags();
                        _this.parsedData = htmlElements;
                        var returnValue = [];
                        var secondSiblingRegExp = _this.createTagRegExp(match[1]);
                        var secondSiblingMatch = void 0;
                        var scrapData = [];
                        for (var u = 0; u < allElements.length; u++) {
                            for (var element = 0; element < htmlElements.length; element++) {
                                var breakingCondition = false;
                                if (allElements[u].outerHTML == htmlElements[element].outerHTML) {
                                    for (var x = u + 1; x < allElements.length; x++) {
                                        if (htmlElements[element].outerHTML.indexOf(allElements[x].outerHTML) > -1) {
                                            continue;
                                        }
                                        else if (!(secondSiblingMatch = allElements[x].outerHTML.
                                            slice(allElements[x].outerHTML.
                                            indexOf('<'), allElements[x].outerHTML.
                                            indexOf('>') + 1).match(secondSiblingRegExp.openingRegExp))) {
                                            break;
                                        }
                                        else if (secondSiblingMatch = allElements[x].outerHTML.
                                            slice(allElements[x].outerHTML.
                                            indexOf('<'), allElements[x].outerHTML.
                                            indexOf('>') + 1).match(secondSiblingRegExp.openingRegExp)) {
                                            if (scrapData.indexOf(allElements[x]['outerHTML']) == -1) {
                                                scrapData.push(allElements[x].outerHTML);
                                                returnValue.push(allElements[x]);
                                                breakingCondition = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (breakingCondition) {
                                    break;
                                }
                            }
                        }
                        _this.parsedData = returnValue;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    else if (tokens[tokens.length - 1] == '>') {
                        var matchingTags = [];
                        var scrapData = [];
                        for (var element = 0; element < _this.parsedData.length; element++) {
                            var matchingElements = _this.parsedData[element].getElementsByTagName(match[1]);
                            for (var _i = 0, matchingElements_2 = matchingElements; _i < matchingElements_2.length; _i++) {
                                var matchingElement = matchingElements_2[_i];
                                var i = void 0;
                                for (i = element + 1; i < _this.parsedData.length; i++) {
                                    if (_this.parsedData[i].outerHTML.indexOf(matchingElement.outerHTML) > -1) {
                                        // if it is in any of the other possible parents
                                        break;
                                    }
                                }
                                if (i == _this.parsedData.length) {
                                    // that means it is not in any of the other matchingTags
                                    if (scrapData.length > 0) {
                                        var u = 0;
                                        for (; u < scrapData.length; u++) {
                                            if (scrapData[u].indexOf(matchingElement.outerHTML) > -1) {
                                                break;
                                            }
                                            else if (u == scrapData.length - 1 && scrapData[u].indexOf(matchingElement.outerHTML) == -1) {
                                                scrapData.push(matchingElement.outerHTML);
                                                matchingTags.push(matchingElement);
                                            }
                                        }
                                    }
                                    else {
                                        scrapData.push(matchingElement.outerHTML);
                                        matchingTags.push(matchingElement);
                                    }
                                }
                            }
                        }
                        _this.parsedData = matchingTags;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    tokens.push(match[0]);
                    var holder = [];
                    if (_this.parsedData.length > 0) {
                        _this.parsedData.forEach(function (htmlElement) {
                            holder = holder.concat(htmlElement.getElementsByTagName(match[0]));
                        });
                        var returnValue = [];
                        var scrapData_3 = [];
                        returnValue = holder.filter(function (element) {
                            if (scrapData_3.indexOf(element.outerHTML) == -1) {
                                scrapData_3.push(element.outerHTML);
                                return true;
                            }
                        });
                        _this.parsedData = returnValue;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    else {
                        var returnValue = _this.getElementsByTagName(match[0]);
                        _this.done = false;
                        return returnValue;
                    }
                }
            },
            {
                regExp: /\.(\w+)/,
                action: function (match, tokens, elements) {
                    if (tokens[tokens.length - 1] == '+') {
                        tokens.push(match[0]);
                        var htmlElements = _this.parsedData;
                        var allElements = _this.parseAllTags();
                        _this.parsedData = htmlElements;
                        var returnValue = [];
                        var secondSiblingRegExp = _this.createTagRegExp(match[1]);
                        var secondSiblingMatch = void 0;
                        var scrapData = [];
                        var attributeRegExp = new RegExp("\\s+class\\s*=\\s*('|\").*?" + match[1] + ".*?(\"|')", 'm');
                        for (var u = 0; u < allElements.length; u++) {
                            for (var element = 0; element < htmlElements.length; element++) {
                                var breakingCondition = false;
                                if (allElements[u].outerHTML == htmlElements[element].outerHTML) {
                                    for (var x = u + 1; x < allElements.length; x++) {
                                        if (htmlElements[element].outerHTML.indexOf(allElements[x].outerHTML) > -1) {
                                            continue;
                                        }
                                        else if (!(secondSiblingMatch = allElements[x].outerHTML.
                                            slice(allElements[x].outerHTML.
                                            indexOf('<'), allElements[x].outerHTML.
                                            indexOf('>') + 1).match(attributeRegExp))) {
                                            break;
                                        }
                                        else if (secondSiblingMatch = allElements[x].outerHTML.
                                            slice(allElements[x].outerHTML.
                                            indexOf('<'), allElements[x].outerHTML.
                                            indexOf('>') + 1).match(attributeRegExp)) {
                                            if (scrapData.indexOf(allElements[x]['outerHTML']) == -1) {
                                                scrapData.push(allElements[x].outerHTML);
                                                returnValue.push(allElements[x]);
                                                breakingCondition = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (breakingCondition) {
                                    break;
                                }
                            }
                        }
                        _this.parsedData = returnValue;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    else if (tokens[tokens.length - 1] == '>') {
                        var matchingTags = [];
                        var scrapData = [];
                        for (var element = 0; element < _this.parsedData.length; element++) {
                            var matchingElements = _this.parsedData[element].getElementsByClassName(match[1]);
                            for (var _i = 0, matchingElements_3 = matchingElements; _i < matchingElements_3.length; _i++) {
                                var matchingElement = matchingElements_3[_i];
                                var i = void 0;
                                for (i = element + 1; i < _this.parsedData.length; i++) {
                                    if (_this.parsedData[i].outerHTML.indexOf(matchingElement.outerHTML) > -1) {
                                        // if it is in any of the other possible parents    
                                        break;
                                    }
                                }
                                if (i == _this.parsedData.length) {
                                    // that means it is not in any of the other matchingTags
                                    if (scrapData.length > 0) {
                                        var u = 0;
                                        for (; u < scrapData.length; u++) {
                                            if (scrapData[u].indexOf(matchingElement.outerHTML) > -1) {
                                                break;
                                            }
                                            else if (u == scrapData.length - 1 && scrapData[u].indexOf(matchingElement.outerHTML) == -1) {
                                                scrapData.push(matchingElement.outerHTML);
                                                matchingTags.push(matchingElement);
                                            }
                                        }
                                    }
                                    else {
                                        scrapData.push(matchingElement.outerHTML);
                                        matchingTags.push(matchingElement);
                                    }
                                }
                            }
                        }
                        _this.parsedData = matchingTags;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    var holder = [];
                    if (_this.parsedData.length > 0) {
                        _this.parsedData.forEach(function (htmlElement) {
                            holder = holder.concat(htmlElement.getElementsByClassName(match[0].slice(1)));
                        });
                        var returnValue = [];
                        var scrapData_4 = [];
                        returnValue = holder.filter(function (element) {
                            if (scrapData_4.indexOf(element.outerHTML) == -1) {
                                scrapData_4.push(element.outerHTML);
                                return true;
                            }
                        });
                        _this.parsedData = returnValue;
                        _this.done = false;
                        return _this.parsedData;
                    }
                    else {
                        var returnValue = _this.getElementsByClassName(match[0].slice(1));
                        _this.done = false;
                        return returnValue;
                    }
                }
            },
            {
                regExp: /\+|>/,
                action: function (match, tokens) {
                    tokens.push(match[0]);
                    return _this.parsedData;
                }
            },
            {
                regExp: /\[(\w+)(([\^\|\~\$\*])?=?('|")(\w+)('|"))?\]/,
                action: function (match, tokens, elements) {
                    tokens.push(match[0]);
                    _this.done = false;
                    return _this.getByAttribute(match[1]);
                }
            }
        ];
        if (typeof outerHTML != 'string') {
            throw new TypeError('Input data must be a string');
        }
        this.outerHTML = outerHTML;
        this.innerHTML = this.innerText = this.textContent = this.outerHTML.slice(this.outerHTML.indexOf('>') + 1, this.outerHTML.lastIndexOf('<'));
        this.textContent = this.innerText = this.textContent.replace(/<.*?>/gi, '');
    }
    HTMLElementData.prototype.getStatus = function () {
        return this.done;
    };
    HTMLElementData.prototype.getAllTags = function (data) {
        var tagsRegex = /<\s*(\w+)\s*.*?>/mi;
        var match;
        var startingIndex = 0;
        var availableTags = [];
        var counter = 0;
        while (match = data.slice(startingIndex).match(tagsRegex)) {
            var tagObject = { tag: match[1], index: counter++ };
            availableTags.push(tagObject);
            var index = match ? typeof (match['index']) == 'number' ? match['index'] : 0 : 0;
            startingIndex += index + match[0].length;
        }
        return availableTags;
    };
    HTMLElementData.prototype.createTagRegExp = function (tagType) {
        var tagRegExp = new RegExp("<\\s*" + tagType + "(\\s*|\\s+).*?>|<\\s*/" + tagType + ">", "mi");
        var openingRegExp = new RegExp("<\\s*" + tagType + "(\\s*|\\s+).*?>");
        var closingRegExp = new RegExp("<\\s*/" + tagType + ">");
        return { tagRegExp: tagRegExp, openingRegExp: openingRegExp, closingRegExp: closingRegExp };
    };
    HTMLElementData.prototype.getElementsByTagName = function (tag) {
        this.parsedData = [];
        var match;
        var matchRegex = this.createTagRegExp(tag);
        var data_copy = this.innerHTML.slice(0);
        var matches = [];
        while (match = (matchRegex.tagRegExp).exec(data_copy)) {
            var index = match ? typeof (match['index']) == 'number' ? match['index'] : 0 : 0;
            data_copy = data_copy.slice(match[0].length + index);
            if (matches.length > 0) {
                match['index'] = matches[matches.length - 1]['index'] + matches[matches.length - 1][0].length + (match['index'] ? match['index'] : 0);
            }
            matches.push(match);
        }
        for (var i = 0; i < matches.length; i++) {
            var openingTag = void 0;
            var closingTagsCounter = 0;
            var openingTagsCounter = 0;
            if (openingTag = matches[i][0].match(matchRegex.openingRegExp)) {
                openingTagsCounter += 1;
                for (var u = i + 1; u < matches.length; u++) {
                    if (matchRegex.openingRegExp.test(matches[u][0])) {
                        openingTagsCounter += 1;
                    }
                    if (matchRegex.closingRegExp.test(matches[u][0])) {
                        closingTagsCounter += 1;
                    }
                    if (openingTagsCounter == closingTagsCounter) {
                        var outerHTML = this.innerHTML.slice(matches[i]['index'], matches[u]['index'] + matches[u][0].length);
                        var node_object = new HTMLElementData(outerHTML);
                        this.parsedData.push(node_object);
                        break;
                    }
                }
                if (closingTagsCounter == 0) {
                    var outerHTML = this.innerHTML.slice(matches[i]['index'], matches[i]['index'] + matches[i][0].length);
                    var node_object = new HTMLElementData(outerHTML);
                    this.parsedData.push(node_object);
                }
            }
        }
        this.done = true;
        return this.parsedData;
    };
    HTMLElementData.prototype.parseAllTags = function () {
        var tags = this.getAllTags(this.innerHTML);
        var elements = [];
        var _loop_1 = function (tag) {
            // get all the tags in this array that is of this type;
            var relatives = tags.filter(function (tagData) {
                if (tagData.tag == tag.tag) {
                    return true;
                }
            });
            var temp = this_1.getElementsByTagName(tag.tag);
            temp.forEach(function (element, index) {
                elements[relatives[index]['index']] = element;
            });
        };
        var this_1 = this;
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            _loop_1(tag);
        }
        this.parsedData = elements;
        return this.parsedData;
    };
    HTMLElementData.prototype.getByAttribute = function (attribute, attributeValue) {
        var attributeRegExp = new RegExp(attribute + "=\\s*('|\")((\\b" + attributeValue + "\\b.*?)|(.*?\\b" + attributeValue + "\\b.*?)|(.*?\\b" + attributeValue + "\\b))(\"|')", 'mi');
        if (this.parsedData.length == 0 || this.done) {
            this.parseAllTags();
        }
        var matchingTags = [];
        for (var i = 0; i < this.parsedData.length; i++) {
            if (this.parsedData[i]['outerHTML']
                .slice(this.parsedData[i]['outerHTML']
                .indexOf('<'), this.parsedData[i]['outerHTML']
                .indexOf('>') + 1)
                .match(attributeRegExp)) {
                matchingTags.push(this.parsedData[i]);
            }
        }
        this.parsedData = matchingTags;
        return matchingTags;
    };
    HTMLElementData.prototype.getElementsByClassName = function (classValue) {
        this.done = true;
        return this.getByAttribute('class', classValue);
    };
    HTMLElementData.prototype.querySelectorAll = function (query) {
        this.parsedData = this.done ? [] : this.parsedData;
        var tokens = [];
        query = query.trim();
        while (query.length) {
            var match = void 0;
            for (var _i = 0, _a = this.patterns; _i < _a.length; _i++) {
                var pattern = _a[_i];
                if (match = query.match(pattern.regExp)) {
                    if (match['index'] == 0) {
                        this.parsedData = pattern.action(match, tokens);
                        query = query.slice(match[0].length).trim();
                        break;
                    }
                    else {
                        continue;
                    }
                }
            }
        }
        this.done = true;
        return this.parsedData;
    };
    HTMLElementData.prototype.querySelector = function (query) {
        var returnValue = this.querySelectorAll(query).slice(0, 1)[0] ? this.querySelectorAll(query).slice(0, 1)[0] : null;
        this.done = true;
        return returnValue;
    };
    HTMLElementData.prototype.getAttribute = function (attribute) {
        var attributeRegExp = new RegExp(attribute + "\\s*=\\s*('|\")(.*?)(\"|')", 'mi');
        var outerHTML = this.outerHTML.slice(this.outerHTML.indexOf('<'), this.outerHTML.indexOf('>') + 1);
        var match = outerHTML.match(attributeRegExp);
        this.done = true;
        return match ? match[2] : null;
    };
    return HTMLElementData;
}());
exports.default = HTMLElementData;
