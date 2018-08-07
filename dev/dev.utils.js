'use strict';
const fs = require('fs-extra');
module.exports.readJsonWithComments = function(path){
    var jsonString = fs.readFileSync(path, 'utf8');
    var lines = jsonString.split('\n');
    var line;
    var jsonLines = '';
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        if(!line.trim().startsWith('//')){
            jsonLines += line + '\n';
        }
    }
    return JSON.parse(jsonLines);
};