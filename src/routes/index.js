"use strict";
var express = require('express');
var router = express.Router();
var response_utils = require(global.__base + 'common/response_utils');
var cache = require(global.__base + 'routes/cache');
var status_codes = require(global.__base + 'common/status_codes');

router.use(function (req, res, next) {
	var req_info = {};

	req_info.reqBodyParams = JSON.stringify(req.body || {});
	req_info.reqQueryParams = JSON.stringify(req.query || {});
	req_info.reqHeaders = JSON.stringify(req.headers || {});
	req_info.reqUrl = req.originalUrl;
	req.log.info(req_info, "Input Data");
	next();
});

router.use('/api/cache', cache);

/*
 * Default action
 */
router.use(function(req, res, next){
	res.status(404);
	response_utils.respondAndLog(req, res, status_codes.NOT_FOUND);
});


module.exports = router;