const beautifulDom = require('../dist/index.js');
const fs = require('fs');

const htmlFile = fs.readFileSync('data/test.html').toString();

const dom = new beautifulDom(htmlFile); 
const node = dom.getElementsByClassName('section-content')[0];

describe('HTML Node object; its properties and methods', function(){

    test('should return all paragraph nodes inside the node', function(){
        expect(node.getElementsByTagName('p')).toHaveLength(546);
    });

    test('should return the class value', function(){
        expect(node.getAttribute('class')).toBe('section-content');
    });

    test('should return all the elements with the class name', function(){
        expect(node.getElementsByClassName('graf--p')).toHaveLength(546);
    }); 

    test('should return all the elements tags in the dom', function(){
        expect(node.querySelectorAll('p')).toHaveLength(546);
    });

    test('should return a single node that satisfies the complex CSS query', function(){
        expect(dom.querySelector('h4#8fb7')).not.toBeNull();
    });

})