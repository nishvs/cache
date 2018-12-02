"use strict";
var express = require('express');
var router = express.Router();

var cache = require(global.__base + '/handlers/cache.js');
var error = require(global.__base + 'common/error.js');
// var status_codes = require(global.__base + 'common/status_codes');

router.get('/', cache.getAllItem, error);
router.get('/:key', cache.getItem, error);
router.post('/', cache.storeItem, error);
router.delete('/', cache.removeItem, error);
router.delete('/:key', cache.removeItem, error);

/*router.get('/inventory/:id', item.getSingleItem, error);
router.put('/inventory', item.updateItem, error);*/

module.exports = router;