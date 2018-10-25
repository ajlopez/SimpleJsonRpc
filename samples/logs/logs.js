
var util = require('util');
var sjr = require('../..'); // require('simplejsonrpc');

var client = sjr.client(process.argv[2]);  

client.call('eth_getLogs', [{ fromBlock: 1, toBlock: "latest" }], console.log);


