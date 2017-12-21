const express = require('express');
const bodyParser = require('body-parser');

var app = express();
var port = 3003;
var dbs = {};

app.use(bodyParser.json({
  extended: true
}));

app.get('/:db/:key', function (req, res) {
	var params = req.params;
	var db = params.db;
	var key = params.key;
		
	res.setHeader('Content-Type', 'application/json');
	if(dbs[db] && dbs[db][key]){
		res.json(dbs[db][key].data);
	} else {
		res.json({});
	}
});

app.put('/:db/:key', function (req, res) {
	var params = req.params;
	var db = params.db;
	var key = params.key;
	
	dbs[db] = dbs[db] || {};
	dbs[db][key] = {
		data : req.body
	};
	res.json({
		status : 'ok',
		data: req.body
	});
});

app.listen(port, function () {
	console.log('LuppoloDB started on port ' + port + '!');
});