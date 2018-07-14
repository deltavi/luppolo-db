'use strict';
//requires
const jpath = require('jsonpath');

//DB Store
var dbs = {};

//private
function _createResult(result, db, key, value, lastUpdate) {
    var ret = {
        result: result,
        db: db
    };
    if (key) {
        ret.key = key;
    }
    if (value != undefined) {
        ret.value = value;
    }
    if (lastUpdate) {
        ret.lastUpdate = lastUpdate;
    }
    return ret;
}

//
function get(db, key) {
    if (dbs[db] && dbs[db][key]) {
        var content = dbs[db][key];
        return _createResult('found', db, key, content.value, content.lastUpdate);
    } else {
        return _createResult('unknown', db, key);
    }
}

function put(db, key, value) {
    dbs[db] = dbs[db] || {};
    var result = dbs[db][key] ? 'updated' : 'created';

    dbs[db][key] = {
        value: value,
        lastUpdate: new Date().toISOString()
    };
    return _createResult(result, db, key);
}

function increment(db, key, incNumber) {
    incNumber = incNumber || 1;
    dbs[db] = dbs[db] || {};
    var result = dbs[db][key] ? 'updated' : 'created';
    dbs[db][key] = dbs[db][key] || {
        value: 0
    };
    var ret;
    if (isNaN(dbs[db][key].value)) {
        ret = _createResult('error', db, key, dbs[db][key].value);
        ret.message = 'value is NaN.';
    } else if (isNaN(incNumber)) {
        ret = _createResult('error', db, key, dbs[db][key].value);
        ret.message = 'incNumber is NaN.';
    } else {
        dbs[db][key].value += parseInt(incNumber);
        dbs[db][key].lastUpdate = new Date().toISOString();
        ret = _createResult(result, db, key, dbs[db][key].value);
    }
    
    return ret;
}

function del(db, key) {
    var ret;
    if (dbs[db] && dbs[db][key]) {
        var oldContent = dbs[db][key];
        ret = _createResult('deleted', db, key, oldContent.value, oldContent.lastUpdate);
        delete dbs[db][key];
    } else {
        ret = _createResult('unknown', db, key);
    }
    return ret;
}

function listDB(unwrapped) {
    var keys = Object.keys(dbs);
    if(unwrapped){
        return keys
    }
    var ret = _createResult('found', '_all');
    ret.names = keys;
    ret.total = keys.length;
    return ret;
}

function getDBs() {
    return _createResult('found', '_all', null, dbs);
}

function keys(db) {
    var ret;
    if (dbs[db]) {
        ret = _createResult('found', db);
        ret.keys = Object.keys(dbs[db]);
        ret.total = ret.keys.length;        
    } else {
        ret = _createResult('unknown', db);
        ret.total = 0;
        ret.keys = [];
    }
    return ret;
}

function count(db) {
    var ret;
    if (dbs[db]) {
        ret = _createResult('found', db);
        ret.total = Object.keys(dbs[db]).length;        
    } else {
        ret = _createResult('unknown', db);
        ret.total = 0;
    }
    return ret;
}

function search(db, query) {
    var ret;
    if (dbs[db]) {
        if(query.hasOwnProperty('jpath')){
            ret = _createResult('found', db);
            ret.hits = jpath.query(dbs[db], query.jpath);
            ret.total = ret.hits.length;
        } else if(query.hasOwnProperty('jpath-nodes')){
            ret = _createResult('found', db);
            ret.hits = jpath.nodes(dbs[db], query['jpath-nodes']);
            ret.total = ret.hits.length;
        } else {
            ret = _createResult('error', db);
            ret.message = 'Unknown query type.';
            ret.query = query;
        }
    } else {
        ret = _createResult('unknown', db);
        ret.total = 0;
    }
    return ret;
}

// exports
module.exports.get = get;
module.exports.put = put;
module.exports.increment = increment;
module.exports.delete = del;
module.exports.listDB = listDB;
module.exports.keys = keys;
module.exports.count = count;
module.exports.search = search;
module.exports.getDBs = getDBs;