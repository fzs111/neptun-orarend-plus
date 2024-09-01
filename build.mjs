import fs from 'node:fs';

const userscriptFile = fs.readFileSync('src/js/userscript.js', { encoding: 'utf8' });
let htmlFile = fs.readFileSync('src/index.html', { encoding: 'utf8' });

htmlFile = replaceExactlyOnce(
    htmlFile, 
    /<link rel="stylesheet" href="([^"]+)">/, 
    (_, path) => `<style>${
        fs.readFileSync('src/' + path, { encoding: 'utf8' })
    }</style>`
);

htmlFile = replaceExactlyOnce(
    htmlFile, 
    /<script src="([^"]+)"><\/script>/, 
    (_, path) => `<script>${
        fs.readFileSync('src/' + path, { encoding: 'utf8' })
    }</script>`
);


// The content of this variable is pasted verbatim into a JS file as a string literal. This works because JSON is a subset of JS.
const htmlString = JSON.stringify(htmlFile);

const newUserscriptFile = replaceExactlyOnce(userscriptFile, /\$\$magicalImportHTMLCode\$\$\(\)/, htmlString);

fs.writeFileSync('userscript-final.user.js', newUserscriptFile);

function replaceExactlyOnce(input, search, replace) {
    const regex = new RegExp(search.source, 'g');
    if(regex.exec(input) === null) {
        throw new Error('replaceExactlyOnce: searched value is not found in the input');
    }

    if(regex.exec(input) !== null) {
        throw new Error('replaceExactlyOnce: searched value is found  more than once in the input');
    }

    return input.replace(search, replace);
}