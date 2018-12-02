let config = require(global.__base + 'config')();
let mongoose = require('mongoose');
let bluebird = require('bluebird');
mongoose.Promise = bluebird;

let Mongoose = function(log) {
	this.log = log || console;
	let index = 0;
	this.connection_string = "mongodb://";
	if(config.db.username && config.db.username!= "" && config.db.password && config.db.password!= ""){
		this.connection_string += config.db.username+":"+config.db.password+"@";
	}
	for(index = 0; index < config.db.servers.length; ++index) {
		this.connection_string += config.db.servers[index].host 
						+ ":" + config.db.servers[index].port;
		this.connection_string += ',';
	}
	this.connection_string = this.connection_string.slice(0, -1);
	this.connection_string += '/';
	this.connection_string += config.db.db_name;
	if(config.db.replicaSet && config.db.replicaSet!= "" ){
		this.connection_string += '?replicaSet=' + config.db.replica_set
	}
	if(config.db.authSource && config.db.authSource!= "" ){
		this.connection_string += "&authSource="+config.db.authSource;
	}	
	log.info(this.connection_string)
};

Mongoose.prototype.init = function(callback) {
	let self = this;
	
	mongoose.connect(this.connection_string,config.db.db_options, function(err, client){
	  if(err){
		self.log.error({error: err}, 'Error occurred while connecting to mongoose');
		console.log(err)
		callback(err);
	  }else{
	    self.log.info('Successfully connected to mongoose');
	    self.client = client;
	    callback(null);
	  }
	});
}

module.exports = Mongoose;
