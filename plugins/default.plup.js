module.exports = {
    name : 'Default Plugin',
    description : 'Manage the plugins REST API',
    init : function(app, db, context){
        const luppoloUIRoot = '/luppolo/ui';
        app.get(luppoloUIRoot + '/plugins', function (req, res) {
        	res.render('plugins', {
        		title: context.serverName,
        		plugins: context.plugins
        	});
        });

        app.get(luppoloUIRoot + '/plugins/:pluginId', function (req, res) {
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
    },
    handlers: {
        'pre_listDB' : function(args){
            console.log('pre_listDB', args);
        },
        'post_listDB' : function(args){
            console.log('post_listDB', args);
        }
    }
}