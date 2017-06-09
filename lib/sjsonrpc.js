
function Client() {
	this.call = function () {};
}

function createClient(options) {
	return new Client();
}

module.exports = {
	client: createClient
};