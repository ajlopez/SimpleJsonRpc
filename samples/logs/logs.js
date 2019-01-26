
var util = require('util');
var sjr = require('../..'); // require('simplejsonrpc');

var client = sjr.client(process.argv[2]);  

client.call('eth_getLogs', [{ fromBlock: "0x01", toBlock: "latest" }], function (err, data) {
        if (err)
            console.log(err);
        else
            console.dir(data);
});


