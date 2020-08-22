const beautifulDom = require('../dist/index.js');
const fs = require('fs');

const htmlFile = fs.readFileSync('data/test.html').toString();

console.log(beautifulDom, "type is", typeof(beautifulDom))
console.log(beautifulDom)

const dom = new beautifulDom(htmlFile);

describe('HTML DOM object and its methods', function(){

    test('should throw an error', function(){
        expect(function(){
            var domObject = new beautifulDom(32);
        }).toThrow();
    });

    test('should return all paragraph nodes', function(){
        expect(dom.getElementsByTagName('p')).toHaveLength(550);
    });

    test('should return all anchor tags', function(){
        expect(dom.getElementsByTagName('a')).toHaveLength(136)
    });

    test('should return all the elements with the class name', function(){
        expect(dom.getElementsByClassName('graf--p')).toHaveLength(548);
    }); 
    test('should return all the elements tags in the dom', function(){
        expect(dom.querySelectorAll('p')).toHaveLength(550);
    });

    test('should return all the single node with specific id', function(){
        expect(dom.getElementById('8fb7')).not.toBeNull();
    })

    test('should return a single node that satisfies the complex CSS query', function(){
        expect(dom.querySelector('h4#8fb7')).not.toBeNull();
    });

    test('should return an array of elements with name specified', function(){
        expect(dom.getElementsByName('c1a5')).toHaveLength(1);
    });
})