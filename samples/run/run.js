
const sjr = require('../..'); // require('simplejsonrpc');
const simpleargs = require('simpleargs');

simpleargs
	.define('p', 'port', 3000, 'Port number')
    .define('h', 'host', 'localhost', 'Host name/address')
    .define('m', 'method', '', 'Method')
    .define('a', 'arguments', '', 'Arguments')
    .define('pr', 'protocol', 'http', 'Protocol')
    .define('l', 'log', false, 'Log', { flag: true });
	
const options = simpleargs(process.argv.slice(2));

function getArguments(args) {
	if (!args || args.length === 0)
		return [];

    console.dir(args);
    
	return args.toString().split(',');
}

let client;

if (options._ && options._.length)
    client = sjr.client(options._[0]);
else
    client = sjr.client({
        protocol: options.protocol,
        host: options.host,
        port: options.port
    });

client.setLog(options.log);

client.call(options.method, getArguments(options.arguments), function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(JSON.stringify(data, null, 4));
});


	

