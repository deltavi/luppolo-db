'use strict';
const fs = require('fs-extra');
const readme = 'README.md';
var mdFile = fs.readFileSync(readme, 'utf8');
mdFile = mdFile.replace(/###\s(.*)\n\n\$REST/, function (v0, v1) {
    return '### `' + v1.toUpperCase() + '`';
});
//console.log(mdFile);
fs.writeFileSync(readme, mdFile);