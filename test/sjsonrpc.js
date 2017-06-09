
var sjr = require('..');

exports['sjr as object'] = function (test) {
	test.ok(sjr);
	test.equal(typeof sjr, 'object');
};

exports['sjr create client with dummy provider'] = function (test) {
	var client = sjr.client({
		rpc: function () {}
	});
	
	test.ok(client);
	test.equal(typeof client, 'object');
	test.equal(typeof client.call, 'function');
}

exports['call dummy provider'] = function (test) {
	test.async();
	
	var client = sjr.client({
		call: function (method, args, cb) {
			cb(null, { method: method, args: args });
		}
	});
	
	client.call('method1', ['arg1', 'arg2'], function(err, data) {
		test.equal(err, null);
		test.ok(data);
		test.deepEqual(data, { method: 'method1', args: [ 'arg1', 'arg2' ]});
		test.done();
	});
}

