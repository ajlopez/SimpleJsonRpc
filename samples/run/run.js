
var sjr = require('../..'); // require('simplejsonrpc');
var simpleargs = require('simpleargs');

simpleargs
	.define('p', 'port', 3000, 'Port number')
    .define('h', 'host', 'localhost', 'Host name/address')
    .define('m', 'method', '', 'Method')
    .define('a', 'arguments', '', 'Arguments');
	
var options = simpleargs(process.argv.slice(2));

function getArguments(args) {
	if (!args || args.length === 0)
		return [];
		
	return args.split(',');
}

var client = sjr.client({
	protocol: 'http',
	host: options.host,
	port: options.port
});

client.call(options.method, getArguments(options.arguments), function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(data);
});


	

