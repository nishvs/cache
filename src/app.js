global.__base = __dirname + '/';

let bunyan = require('bunyan');
let express = require('express');
let bodyParser = require('body-parser');
let http = require('http');
let cluster = require('cluster');
let compression = require('compression');
let helmet = require('helmet');

let config = require(global.__base + 'config')();
let Bootstrap = require(global.__base + 'bootstrap.js');

let port = (config.port || '3001');
let num_cpus = require('os').cpus().length;
let clusterid = 0;
let log;


if(cluster.isWorker) {
	clusterid = cluster.worker.id;
}

if(config.isProduction) {
	log = bunyan.createLogger({name: 'nodeapp', clusterid: clusterid});
} else {
	log = bunyan.createLogger({name: 'nodeapp', level: 'debug', clusterid: clusterid});
}
let bootstrap = new Bootstrap(log);

bootstrap.init(function(err) {
	if(err) {
		throw err;
	} else {
		let routes = require(global.__base + 'routes/index.js');
		let app = express();
		app.use(compression());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bootstrap.dataLoader);
		app.use(helmet())
		app.set('port', port);
		app.use('/', routes);

		let travel_server = http.createServer(app);

		if (cluster.isMaster) {
			for (let i = 0; i < num_cpus; i++) {
				cluster.fork();
			}

			cluster.on('exit', function(worker, code, signal) {
				let new_worker = cluster.fork();
				log.error('worker ' + worker.process.pid + ' died');
				log.warn('worker ' + new_worker.process.pid + ' born');
			});
		} else {
			travel_server.listen(port);
			travel_server.on('listening', function() {
				let addr = travel_server.address();
				let bind = typeof addr === 'string'? 'pipe ' + addr : 'port ' + addr.port;
				log.info('Express server listening on port ' + bind + ' clusterid: ' + clusterid);
			});
			module.exports = travel_server; // Unit Test export
		}
	}
});

process.on('uncaughtException', function(err) {
	log.error('Something broke!!! - ' + err.stack);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});