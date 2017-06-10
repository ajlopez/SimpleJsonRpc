
var server;

exports['start http server'] = function (test) {
	test.async();
	
	server = require('http').createServer(function (req, res) {});
	
	server.listen(3000, function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
}

exports['stop http server'] = function (test) {
	test.async();
	
	server.close(function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
}

