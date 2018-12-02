// module.exports = require('./'+(process.env.NODE_ENV || 'local')+'.json')
let config = require('./config.json')
module.exports = function(){
	let env = process.env.NODE_ENV || 'development'
	return config[env]
}