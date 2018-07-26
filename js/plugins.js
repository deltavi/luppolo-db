const fs = require('fs');
const logger = require('./logger');
const pluginExtension = '.plup.js';
const plugins = [];
const handlers = {};
module.exports.list = plugins;
module.exports.handlers = handlers;
module.exports.load = function(app, db, context){
    const files = fs.readdirSync('./plugins');
    context.plugins = plugins;
    files.forEach(function(file){
        if(file.endsWith(pluginExtension)){
            const plugin = require('../plugins/' + file);
            logger.info('Loading plugin "' + file + '" ("' + (plugin.name || 'unnamed') + '")');
            plugin.init(app, db, context);
            plugin.id = file;
            if(plugin.handlers){
                const handlerKeys = Object.keys(plugin.handlers);
                if (handlerKeys.length > 0){
                    handlerKeys.forEach(function(key){
                        if (typeof plugin.handlers[key] === "function") {
                            handlers[key] = handlers[key] || [];
                            handlers[key].push(plugin.handlers[key]);
                        }
                    });
                    logger.info('Plugin "' + file + '" handlers: ' + Object.keys(plugin.handlers));
                }
            }
            logger.info('Plugin "' + file + '" loaded successfully!');
            plugins.push(plugin);
        }
    });
    var handlersStats = [];
    Object.keys(handlers).forEach(function(key){
        handlersStats.push(handlers[key].length + ' ' + key);
    });
    if (plugins.length > 0){
        if(handlersStats.length > 0){
            logger.info(plugins.length + ' plugins loaded, handlers: ' + handlersStats);
        } else {
            logger.info(plugins.length + ' plugins loaded with no handlers');
        }
    } else {
        logger.info('No plugins found!');
    }
}
