const fs = require('fs');
const logger = require('./logger');
const pluginExtension = '.plup.js';
const plugins = [];
module.exports.list = plugins;
module.exports.load = function(app, db, context){
    const files = fs.readdirSync('./plugins');
    context.plugins = plugins;
    files.forEach(function(file){
        if(file.indexOf(pluginExtension) > 0){
            const plugin = require('../plugins/' + file);
            logger.info('Loading plugin "' + file + '" ("' + (plugin.name || 'unnamed') + '")');
            plugin.init(app, db, context);
            plugin.id=file;
            logger.info('Plugin "' + file + '" loaded successfully!');
            plugins.push(plugin);
        }
    });
}
