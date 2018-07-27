'use strict';
// requires
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./js/db');
//const utils = require('./js/utils');
const config = require('./config');
const pretty = require('express-prettify');
const logo = require('./js/logo');
const logger = require('./js/logger');
const plugins = require('./js/plugins');
const constants = require('./js/constants');

// Logo
logo.printLogo('logo.txt', constants.luppoloVersion);
logger.info('Initializing...');

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
	logger.info(constants.luppoloName + ' is available at URL ' + serverUrl);
});

// PLUGINS Manager
plugins.load(app, db, {
	serverName : constants.luppoloName
});

// UI endpoint
app.get('/', function (req, res) {
	res.redirect(constants.luppoloUIRoot);
});

app.get(constants.luppoloRoot, function (req, res) {
	res.redirect(constants.luppoloUIRoot);
});

app.get(constants.luppoloUIRoot, function (req, res) {
	res.render('index', {
		title: constants.luppoloName,
		dbs: db.listDB(true)
	});
});

app.get(constants.luppoloUIRoot + '/:db', function (req, res) {
	var params = req.params;
	res.render('db', {
		title: constants.luppoloName,
		db: params.db,
		keys: db.keys(params.db).keys
	});
});

app.get(constants.luppoloUIRoot + '/:db/_search', function (req, res) {
	var params = req.params;
	res.render('search', {
		title: constants.luppoloName,
		db: params.db
	});
});

app.get(constants.luppoloUIRoot + '/test/:total', function (req, res) {
	var params = req.params;
	var total = parseInt(params.total);
	for (let i = 0; i < total; i++) {
		db.put('testDB', 'key_' + i, { val: i });
	}
	res.json({ test: 'ok' });
});

// GET ALL DBS
app.get(constants.luppoloDbsRoot , function (req, res) {
	var query = req.query;
	var json;
	if (query.hasOwnProperty('_export')) {
		json = db.getDBs();
	} else if (query.hasOwnProperty('_persist')) {
		json = db.saveDBs();
	} else if (query.hasOwnProperty('_restore')) {
		json = db.restoreDBs();
	} else {
		json = db.listDB();
	}
	res.setHeader('Content-Type', 'application/json');
	res.json(json);
});

// GET
app.get(constants.luppoloDbRoot + '/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.get(params.db, params.key));
});

// GET DB KEYS
app.get(constants.luppoloDbRoot + '/:db', function (req, res) {
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
app.put(constants.luppoloDbRoot + '/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.put(params.db, params.key, req.body));
});

// DELETE
app.delete(constants.luppoloDbRoot + '/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.delete(params.db, params.key));
});

// SEARCH
app.post(constants.luppoloDbRoot + '/:db/_search', function (req, res) {
	var params = req.params;
    res.setHeader('Content-Type', 'application/json');
    res.json(db.search(params.db, req.body));
});

// NUMERIC INCREMENT
app.put(constants.luppoloDbRoot + '/:db/:key/_increment/:incNumber?', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.increment(params.db, params.key, params.incNumber));
});

