module.exports = {
    name : 'Default Plugin',
    type : 'printer',
    init : function(app, db, context){
        const luppoloUIRoot = '/luppolo';
        app.get(luppoloUIRoot + '/_plugins', function (req, res) {
        	res.render('plugins', {
        		title: context.serverName,
        		plugins: context.plugins
        	});
        });

        app.get(luppoloUIRoot + '/_plugins/:pluginId', function (req, res) {
        	var params = req.params;
        	var pluginFound = {
        	    name : 'unknown'
        	};
        	context.plugins.some(function(plugin){
        	    if(params.pluginId === plugin.id){
        	        pluginFound = plugin;
        	        return true;
        	    }
        	})
        	res.json(pluginFound);
        });
    }
}