
var http = require('http');
var https = require('https');
var url = require('url');

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

function HttpProvider(options, http) {
    const self = this;
    
	if (typeof options === 'string') {
		var address = url.parse(options);
		
		options = {
			host: address.hostname,
			port: address.port,
			path: address.path
		};
	}
    
	var id = 1;
	
	this.call = function (method, args, cb) {
        if (!cb)
            return promisify(cb => self.call(method, args, cb));
        
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
			path: options.path || '/',
			headers: {
				'Content-Type': 'application/json',
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
    const self = this;
    
	this.call = function (method, args, cb) {
        if (!cb)
            return promisify(cb => self.call(method, args, cb));
        
		provider.call(method, args, cb);
	};
}

function createProvider(options) {
	if (typeof options === 'string' && options.substring(0,5) === 'http:')
		return new HttpProvider(options, http);
	
	if (typeof options === 'string' && options.substring(0,6) === 'https:')
		return new HttpProvider(options, https);

	if (options.call)
		return options;
	
	if (options.protocol === 'http')
		return new HttpProvider(options, http);

	if (options.protocol === 'https')
		return new HttpProvider(options, https);
}

function createClient(options) {
	return new Client(createProvider(options));
}

module.exports = {
	client: createClient
};

