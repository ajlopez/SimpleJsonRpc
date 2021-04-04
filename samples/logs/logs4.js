
var util = require('util');
var sjr = require('../..'); // require('simplejsonrpc');

var client = sjr.client(process.argv[2]);  

client.call('eth_getLogs', [{ fromBlock: "0x11EB80", toBlock: "0x11F4CB", address: "0x74808B7a84327c66bA6C3013d06Ed3DD7664b0D4" }], function (err, data) {
        if (err)
            console.log(err);
        else
            console.dir(data);
});


