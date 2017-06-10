
var http = require('http');

function HttpProvider(options) {
	var id = 1;
	
	if (options.path)
		reqoptions.path = options.path;
	
	this.call = function (method, args, cb) {
		var data = {
			id: id++,
			jsonrpc: "2.0",
			method: method,
			params: args
		};
		
		data = JSON.stringify(data);
		
		var reqoptions = {
			hostname: options.host || 'localhost',
			port: options.port || 3000,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(data)
			}
		};
		
		var request = http.request(reqoptions, function (res) {
			var buffer = '';

			res.on('data', function(d) {
				var text = d.toString();
				buffer += text;
			});

			res.on('err', function(err) {
				cb(err);
			});

			res.on('end', function(d) {
				if (d) {
					var text = d.toString();
					buffer += text;
				}
				
				try {
					var result = JSON.parse(buffer);
					
					if (result.error)
						cb(result.error);
					else
						cb(null, result.result);
				}
				catch (err) {
					cb(err);
				}
			});
		});
		
		request.on('error', function (err) { cb(err); });
		
		request.write(data);
		
		request.end();
	}
}

function Client(provider) {
	this.call = function (method, args, cb) {
		provider.call(method, args, cb);
	};
}

function createProvider(options) {
	if (options.call)
		return options;
	
	if (options.protocol === 'http')
		return new HttpProvider(options);
}

function createClient(options) {
	return new Client(createProvider(options));
}

module.exports = {
	client: createClient
};

