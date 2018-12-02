let Mongoose = require(global.__base + '/db')
let log,mongoose

let Bootstrap = function(temp_log) {
	log = temp_log;
	mongoose = new Mongoose(log);
}

Bootstrap.prototype.init = function(callback) {
	let self = this;
	mongoose.init(function(err){
		if(err)
			callback(err)
		else
			callback()
	})
}

Bootstrap.prototype.dataLoader = function(req, res, next) {
	var self = this;
	req.log = log.child({clientId: (req.query.deviceIdentifier || 'Unknown'),
						remoteIp: req.headers['x-real-ip'],
						clientIp: req.headers['x-forwarded-for'],
						route: req.baseUrl + req.path});

	req.startTime = new Date();
	next();
}

module.exports = Bootstrap;