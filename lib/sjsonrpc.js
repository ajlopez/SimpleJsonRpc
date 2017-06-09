
function Client(provider) {
	this.call = function (method, args, cb) {
		provider.call(method, args, cb);
	};
}

function createClient(options) {
	return new Client(options);
}

module.exports = {
	client: createClient
};