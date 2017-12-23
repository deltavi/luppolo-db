var dbs = {};

function get(db, key){
    if(dbs[db] && dbs[db][key]){
		return dbs[db][key].data;
	} else {
		return {};
	}
}

function put(db, key, value){
    dbs[db] = dbs[db] || {};
	dbs[db][key] = {
		data : value
	};
	return 'ok';
}

function listDB(){
	return Object.keys(dbs);
}

function keys(db){
	return Object.keys(dbs[db]);
}

// exports
module.exports.get = get;
module.exports.put = put;
module.exports.listDB = listDB;
module.exports.keys = keys;