const express = require('express');
const bodyParser = require('body-parser');
const db = require('./js/db');
const config = require('./config');
const pjson = require('./package.json');
const pretty = require('express-prettify');

const luppoloName = 'LuppoloDB v.' + pjson.version;

var app = express();
app.set('view engine', 'pug');
app.use(pretty({ query: 'pretty' }));

app.use(bodyParser.json({
	extended: true
}));

app.get('/', function (req, res) {
	res.redirect('/luppolo');
});

app.get('/luppolo', function (req, res) {
	res.render('index', {
		title: luppoloName,
		dbs: db.listDB()
	})
});

app.get('/luppolo/:db', function (req, res) {
	var params = req.params;
	res.render('db', {
		title: luppoloName,
		db: params.db,
		keys: db.keys(params.db)
	})
});

app.get('/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.get(params.db, params.key));
});

app.put('/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		status: db.put(params.db, params.key, req.body)
	});
});

app.listen(config.server.port, function () {
	console.log(luppoloName + ' started on port ' + config.server.port + '!');
});