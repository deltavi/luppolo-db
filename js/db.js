var dbs = {};

function get(db, key) {
    if (dbs[db] && dbs[db][key]) {
        var content = dbs[db][key];
        return _createResult('found', db, key, content.data, content.lastUpdate);
    } else {
        return _createResult('unknown', db, key);
    }
}

function put(db, key, value) {
    dbs[db] = dbs[db] || {};
    var result = dbs[db][key] ? 'updated' : 'created';

    dbs[db][key] = {
        data: value,
        lastUpdate: new Date().toISOString()
    };
    return ret = _createResult(result, db, key);
}

function del(db, key) {
    var ret;
    if (dbs[db] && dbs[db][key]) {
        var oldContent = dbs[db][key];
        ret = _createResult('deleted', db, key, oldContent.data, oldContent.lastUpdate);
        delete dbs[db][key];
    } else {
        ret = _createResult('unknown', db, key);
    }
    return ret;
}

function _createResult(result, db, key, value, lastUpdate) {
    var ret = {
        result: result,
        db: db,
        key: key
    };
    if (value) {
        ret.value = value;
    }
    if (lastUpdate) {
        ret.lastUpdate = lastUpdate;
    }
    return ret;
}

function listDB() {
    return Object.keys(dbs);
}

function keys(db) {
    return Object.keys(dbs[db] || []);
}

// exports
module.exports.get = get;
module.exports.put = put;
module.exports.delete = del;
module.exports.listDB = listDB;
module.exports.keys = keys;