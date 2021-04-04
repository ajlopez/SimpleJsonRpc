
var util = require('util');
var sjr = require('../..'); // require('simplejsonrpc');

var client = sjr.client(process.argv[2]);  

client.call('eth_getLogs', [{ fromBlock: "0x1239a0", topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", null, null], "address":"0xd1a979ede2c17fcd31800bed859e5ec3da178cb9"}], function (err, data) {
        if (err)
            console.log(err);
        else
            console.dir(data);
});


