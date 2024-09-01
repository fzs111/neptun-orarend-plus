import fs from 'node:fs';

const userscriptFile = fs.readFileSync('src/js/userscript.js', { encoding: 'utf8' });
let htmlFile = fs.readFileSync('src/index.html', { encoding: 'utf8' });
const cssFile = fs.readFileSync('src/css/index.css', { encoding: 'utf8' });
const jsFile = fs.readFileSync('src/js/index.js', { encoding: 'utf8' });

htmlFile = replaceExactlyOnce(htmlFile, '<magical-import-css>', `<style>${cssFile}</style>`);
htmlFile = replaceExactlyOnce(htmlFile, '<magical-import-js>', `<script>${jsFile}</script>`);


// The content of this variable is pasted verbatim into a JS file as a string literal. This works because JSON is a subset of JS.
const htmlString = JSON.stringify(htmlFile);

const newUserscriptFile = replaceExactlyOnce(userscriptFile, '$$magicalImportHTMLCode$$()', htmlString);

fs.writeFileSync('userscript-final.user.js', newUserscriptFile);

function replaceExactlyOnce(input, search, replace) {
    const firstOccurrence = input.indexOf(search);
    if(firstOccurrence === -1) {
        throw new Error('replaceExactlyOnce: searched value is not found in the input');
    }

    const secondOccurrence = input.indexOf(search, firstOccurrence + 1);

    if(secondOccurrence !== -1) {
        throw new Error('replaceExactlyOnce: searched value is found  more than once in the input');
    }

    return input.replace(search, replace);
}