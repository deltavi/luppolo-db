'use strict';
/*
* Annotations:
* - $REST {title}
* - $INCLUDE {filepath}
*/
const fs = require('fs-extra');
const readme = 'README.md';
var mdFile = fs.readFileSync(readme, 'utf8');

// $REST {title}
mdFile = mdFile.replace(/###\s(.*)\n\n\$REST/g, function (v0, v1) {
    return '### `' + v1.toUpperCase() + '`';
});

// $INCLUDE {filepath}
mdFile = mdFile.replace(/\$INCLUDE\s*(.*)\n/g, function (v0, path) {
    return '```javascript\n' + fs.readFileSync(path, 'utf8') + '\n```\n';
});
//console.log(mdFile);
fs.writeFileSync(readme, mdFile);