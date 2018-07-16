'use strict';
// requires
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./js/db');
const utils = require('./js/utils');
const config = require('./config');
const pjson = require('./package.json');
const pretty = require('express-prettify');
const logger = require('./js/logger');
//
const luppoloName = 'LuppoloDB v.' + pjson.version;
const luppoloUIRoot = '/luppolo';

// express
var app = express();
app.set('view engine', 'pug');
app.use(pretty({ query: 'pretty' }));
app.use(express.static('docs'));

app.use(bodyParser.json({
	extended: true
}));

app.listen(config.server.port, function () {
	const serverUrl = 'http://localhost:' + config.server.port;
	logger.info(luppoloName + ' is available at URL ' + serverUrl);
});

// UI endpoint
app.get('/', function (req, res) {
	res.redirect(luppoloUIRoot);
});

app.get(luppoloUIRoot, function (req, res) {
	res.render('index', {
		title: luppoloName,
		dbs: db.listDB(true)
	});
});

app.get(luppoloUIRoot + '/:db', function (req, res) {
	var params = req.params;
	res.render('db', {
		title: luppoloName,
		db: params.db,
		keys: db.keys(params.db).keys
	})
});

app.get(luppoloUIRoot + '/:db/_search', function (req, res) {
	var params = req.params;
	res.render('search', {
		title: luppoloName,
		db: params.db
	})
});

app.get(luppoloUIRoot + '/test/:total', function (req, res) {
	var params = req.params;
	var total = parseInt(params.total);
	for (let i = 0; i < total; i++) {
		db.put('testDB', 'key_' + i, { val: i });
	}
	res.json({ test: 'ok' });
});

// GET ALL DBS
app.get('/_dbs', function (req, res) {
	var query = req.query;
	var json;
	if (query.hasOwnProperty('_names')) {
		json = db.listDB();
	} else {
		json = db.getDBs();
	}
	res.setHeader('Content-Type', 'application/json');
	res.json(json);
});

// GET
app.get('/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.get(params.db, params.key));
});

// GET DB KEYS
app.get('/:db', function (req, res) {
	var params = req.params;
	var query = req.query;
	var json;
	if (query.hasOwnProperty('_count')) {
		json = db.count(params.db);
	} else {
		json = db.keys(params.db);
	}
	res.setHeader('Content-Type', 'application/json');
	res.json(json);
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

// SEARCH
app.post('/:db/_search', function (req, res) {
	var params = req.params;
    res.setHeader('Content-Type', 'application/json');
    res.json(db.search(params.db, req.body));
});

// NUMERIC INCREMENT
app.put('/:db/:key/_increment/:incNumber?', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.increment(params.db, params.key, params.incNumber));
});