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
module.exports = app; // for testing

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

// DB REST API

/**
 * $REST LIST/EXPORT/PERSIST/RESTORE/DELETE all DBs
 * `GET http://localhost:3003/luppolo/dbs?{action}`
 * 
|Description|action  |
|-----------|--------|
|Get list of databases||
|Exports all the DBs data as JSON|**_export**|
|Save all the DBs data on the file system|**_persist**|
|Restore all the DBs data from the file system|**_restore**|
|Delete all the DBs from the memory and from the file system|**_deleteAndPersist**|
 * ### Examples
 * #### Exports all the DBs data as JSON
 * $INCLUDE ./examples/dbs.export.js
 * @example Get list of database:
 * [GET] "http://localhost:3003/luppolo/dbs"
 * {
 *     "result": "found",
 *     "db": "_all",
 *     "names": [
 *         "db1"
 *     ],
 *     "total": 1
 * }
 * @example Exports all the DBs data as JSON:
 * [GET] "http://localhost:3003/luppolo/dbs?_export"
 * {
 *  "result": "found",
 *     "db": "_all",
 *     "value": {
 *         "db1": {
 *             "1": {
 *                 "value": {
 *                     "boolean": true,
 *                     "number": 123,
 *                     "string": "text",
 *                     "array": [
 *                         "123",
 *                         "456"
 *                     ]
 *                 },
 *                 "lastUpdate": "2018-07-14T09:01:01.748Z"
 *             }
 *         }
 *     }
 * }
 * @example Save all the DBs data on the file system:
 * [GET] "http://localhost:3003/luppolo/dbs?_persist"
 * {
 *   "result": "saved",
 *   "db": "_all"
 * }
 * 
 * or
 * 
 * {
 *   "result": "error",
 *   "db": "_all",
 *   "error": {
 *     "errno": -4048,
 *     "code": "EPERM",
 *     "syscall": "open",
 *     "path": "/luppolo-db/dump/dbs.json"
 *   }
 * }
 * @example Restore all the DBs data from the file system:
 * [GET] "http://localhost:3003/luppolo/dbs?_restore"
 * {
 *   "result": "restored",
 *   "db": "_all"
 * }
 * 
 * or
 * 
 * {
 *   "result": "error",
 *   "db": "_all",
 *   "error": {
 *     "errno": -4058,
 *     "code": "ENOENT",
 *     "syscall": "open",
 *     "path": "/luppolo-db/dump/dbs.json"
 *   }
 * }
 * @example Delete all the DBs from the memory and from the file system:
 * [GET] "http://localhost:3003/luppolo/dbs?_deleteAndPersist"
 * {
 *   "result": "reset",
 *   "db": "_all"
 * }
 * 
 * or
 * 
 * {
 *   "result": "error",
 *   "db": "_all",
 *   "error": {
 *     "errno": -4048,
 *     "code": "EPERM",
 *     "syscall": "open",
 *     "path": "/luppolo-db/dump/dbs.json"
 *   }
 * }
 */
app.get(constants.luppoloDbsRoot , function (req, res) {
	var query = req.query;
	var json;
	if (query.hasOwnProperty('_export')) {
		json = db.getDBs();
	} else if (query.hasOwnProperty('_persist')) {
		json = db.saveDBs();
	} else if (query.hasOwnProperty('_restore')) {
		json = db.restoreDBs();
	} else if (query.hasOwnProperty('_deleteAndPersist')) {
		json = db.deleteDBsAndPersist();
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

// CREATE DB
app.put(constants.luppoloDbRoot + '/:db', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.createDB(params.db));
});


// DELETE KEY
app.delete(constants.luppoloDbRoot + '/:db/:key', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.delete(params.db, params.key));
});

// DELETE DB
app.delete(constants.luppoloDbRoot + '/:db', function (req, res) {
	var params = req.params;
	res.setHeader('Content-Type', 'application/json');
	res.json(db.deleteDB(params.db));
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

// ERROR HANDLING
app.use(/* jshint unused:false */ function (err, req, res, next) {
    var params = req.params;
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    var ret = {
        result: 'error',
        path: req.originalUrl,
        body: req.body,
        errorStack: err.stack
    };
    if (params.db){
        ret.db = params.db;
    }
    res.json(ret);
});