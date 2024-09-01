declare function $$magicalImportHTMLCode$$(): string;

const htmlCode = $$magicalImportHTMLCode$$(); //This call is replaced by a string literal of the bundled HTML file by `build.mjs`

console.log(htmlCode);