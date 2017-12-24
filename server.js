// require
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./js/db');
const config = require('./config');
const pjson = require('./package.json');
const pretty = require('express-prettify');
//
const luppoloName = 'LuppoloDB v.' + pjson.version;
const luppoloUIRoot = '/luppolo';

// express
var app = express();
app.set('view engine', 'pug');
app.use(pretty({ query: 'pretty' }));

app.use(bodyParser.json({
	extended: true
}));

// UI endpoint
app.get('/', function (req, res) {
	res.redirect(luppoloUIRoot);
});

app.get(luppoloUIRoot, function (req, res) {
	res.render('index', {
		title: luppoloName,
		dbs: db.listDB()
	})
});

app.get(luppoloUIRoot + '/:db', function (req, res) {
	var params = req.params;
	res.render('db', {
		title: luppoloName,
		db: params.db,
		keys: db.keys(params.db)
	})
});

// GET
app.get('/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.get(params.db, params.key));
});

// PUT
app.put('/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.put(params.db, params.key, req.body));
});

// DELETE
app.delete('/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.delete(params.db, params.key));
});

app.listen(config.server.port, function () {
	console.log(luppoloName + ' started on port ' + config.server.port + '!');
});