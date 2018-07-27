'use strict';
const constants = require('../js/constants');
module.exports = {
    name : 'Plugins REST API',
    description : 'Manage the plugins REST API',
    init : function(app, db, context){
        app.get(constants.luppoloUIRoot + '/plugins', function (req, res) {
        	res.render('plugins', {
        		title: context.serverName,
        		plugins: context.plugins
        	});
        });

        app.get(constants.luppoloUIRoot + '/plugins/:pluginId', function (req, res) {
        	var params = req.params;
        	var pluginFound = {
        	    name : 'unknown'
        	};
        	context.plugins.some(function(plugin){
        	    if(params.pluginId === plugin.id){
        	        pluginFound = plugin;
        	        return true;
        	    }
        	});
        	var json = Object.assign({}, pluginFound);
            json.handlers = Object.keys(pluginFound.handlers || {});
        	res.json(json);
        });
        module.exports.statusMessage = 'Plugin initialized successfully!';
    },
    handlers: {
    }
};