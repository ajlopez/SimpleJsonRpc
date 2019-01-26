
var sjr = require('..');
var server;

exports['start http server'] = function (test) {
	test.async();
	
	server = require('http').createServer(function (req, res) {		
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

exports['call http server'] = async function (test) {
	const client = sjr.client({
		protocol: 'http',
		host: 'localhost',
		port: 3000
	});
	
	const result = await client.call('method', [1, 2 , 3]);

    test.equal(result, 'Ok');
    test.done();
};

exports['call http server using string address'] = async function (test) {
	const client = sjr.client('http://localhost:3000');
	
	const result = await client.call('method', [1, 2 , 3]);

    test.equal(result, 'Ok');
    test.done();
};

exports['call http server unknown method'] = async function (test) {
	const client = sjr.client({
		protocol: 'http',
		host: 'localhost',
		port: 3000
	});
	
    try {
        await client.call('foo', [1, 2 , 3]);
    }
    catch (err) {
        test.equal(err.message, 'Method not found');
        test.done();
    }
};

exports['stop http server'] = function (test) {
	test.async();
	
	server.close(function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
}

