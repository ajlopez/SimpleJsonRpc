
const http = require('http');
const https = require('https');
const url = require('url');

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

function HttpProvider(options, http) {
    let log = false;
    const self = this;
    
	if (typeof options === 'string') {
		const address = url.parse(options);
		
		options = {
			host: address.hostname,
			port: address.port,
			path: address.path
		};
	}
    
	let id = 1;
	
	this.call = function (method, args, cb) {
        if (!cb)
            return promisify(cb => self.call(method, args, cb));
        
		var data = {
			id: id++,
			jsonrpc: "2.0",
			method: method,
			params: args
		};
        
        if (log)
            console.dir(data);
		
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
        
		const request = http.request(reqoptions, function (res) {
			let buffer = '';

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
                    
                    if (log)
                        console.dir(result);
					
					if (result.error)
						cb(result.error);
					else
						cb(null, result.result);
				}
				catch (err) {
                    if (log)
                        console.dir(buffer);
                    
					cb(err);
				}
			});
		});
		
		request.on('error', function (err) { cb(err); });
		
		request.write(data);
		
		request.end();
	}
    
    this.setLog = function (flag) {
        log = flag;
    };
}

function Client(provider) {
    const self = this;
    
	this.call = function (method, args, cb) {
        if (!cb)
            return promisify(cb => self.call(method, args, cb));
        
		provider.call(method, args, cb);
	};
    
    this.setLog = function (flag) { provider.setLog(flag); };
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

