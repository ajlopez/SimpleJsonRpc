
var sjr = require('..');

var fs = require('fs');
var path = require('path');

var server;

exports['start https server'] = function (test) {
	// https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	
	test.async();

	// files generated with
	// openssl req -newkey rsa:2048 -nodes -keyout private.key -x509 -days 3650 -out private.crt
	var key = fs.readFileSync(path.join(__dirname, 'private.key'));
	var cert = fs.readFileSync(path.join(__dirname, 'private.crt'));	
	
	var options = {
		key: key,
		cert: cert
	};
	
	server = require('https').createServer(options, function (req, res) {		
		if (req.method === 'POST') {
			test.equal(req.headers['content-type'], 'application/json');
			
			var body = '';

			req.on('data', function (data) {
				body += data;
			});

			req.on('end', function () {
				var input = JSON.parse(body);
				
				var data = {
					id: input.id,
					jsonrpc: input.data
				};
				
				if (input.method !== 'method')
					data.error = { code: -32061, message: 'Method not found' };
				else
					data.result = 'Ok';
				
				res.write(JSON.stringify(data));
				
				res.end();
			});
		}
	});
	
	server.listen(3000, function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
}

exports['call https server'] = function (test) {
	test.async();
	
	var client = sjr.client({
		protocol: 'https',
		host: '127.0.0.1',
		port: 3000
	});
	
	console.log('client created');
	
	client.call('method', [1, 2 , 3], function (err, data) {
		test.equal(err, null);
		test.equal(data, 'Ok');
		test.done();
	})
};

exports['call https server using string address'] = function (test) {
	test.async();
	
	var client = sjr.client('https://127.0.0.1:3000');
	
	client.call('method', [1, 2 , 3], function (err, data) {
		test.equal(err, null);
		test.equal(data, 'Ok');
		test.done();
	})
};

exports['call https server unknown method'] = function (test) {
	test.async();
	
	var client = sjr.client({
		protocol: 'https',
		host: '127.0.0.1',
		port: 3000
	});
	
	client.call('foo', [1, 2 , 3], function (err, data) {
		test.ok(err);
		test.equal(err.message, 'Method not found');
		test.done();
	})
};

exports['stop https server'] = function (test) {
	test.async();
	
	server.close(function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
}

