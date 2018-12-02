"use strict";
let util = require('util');
let status_codes = require(global.__base + 'common/status_codes.js');
let response_utils = require(global.__base + 'common/response_utils.js');
let itemModel = require(global.__base + 'models/item.js')
let config = require(global.__base + 'config')();
let misc_utils = require(global.__base + 'common/misc_utils');

let storeItem = (req, res, next)=> {
	if(!req.body || !req.body.key || !req.body.value){
		req.log.info("no item details");
        let err = misc_utils.create_error("Missing Parameters", status_codes.REQUIRED_PARAMETER_MISSING);
        return next(err);
	}else{
		//find using key and update
		//else save new record
		let data = {}
		data.key = req.body.key
		let find_key = itemModel.find(data).exec()

		find_key.then((docs)=>{
			if(docs && docs.length>0){
				let update_data = {}
				update_data.$set = {value:req.body.value}
				itemModel.update(data,update_data,{}).then((update_result)=>{
						response_utils.respondAndLog(req, res, status_codes.SUCCESS, {}, {});
				}).catch(err=>{
					return next(err);
				})
			}else{
				let insert_record = ()=>{
					data.value = req.body.value
					data.ttl = new Date()
					data.ttl.setMinutes(data.ttl.getMinutes()+config.cache_item_time_limit)				
					itemModel.create(data).then((err, data)=> {
						response_utils.respondAndLog(req, res, status_codes.SUCCESS, {}, {});
					}).catch(err=>{
						return next(err);
					})
				}
				itemModel.count({}).then(count=>{
					if(count >= config.cache_limit){
						itemModel.find({}).sort({ttl:1}).limit(1).exec((err,docs)=>{							
							itemModel.remove({key:docs[0].key}).exec(()=>{
								insert_record()
							})							
						})
					}else{
						insert_record()
					}
				})
			}
		}).catch(err=>{
			return next(err);
		})
	}
}

let getAllItem = (req, res, next)=> {
	let find_key = itemModel.find({},{_id:0,key:1}).exec()
	find_key.then((docs)=>{
		var res_key_list = []
		for(var index in docs){
			res_key_list.push(docs[index].key)
		}
		response_utils.respondAndLog(req, res, status_codes.SUCCESS, res_key_list, {});
	}).catch(err=>{
		return next(err);
	})
}

let getItem = (req, res, next)=> {
	if(!req.params || !req.params.key ){
		let err = misc_utils.create_error("Missing Parameters", status_codes.REQUIRED_PARAMETER_MISSING);
        return next(err);
	}else{
		let data = {}
		data.key = req.params.key
		let find_key = itemModel.find(data,{_id:0,key:1,value:1,ttl:1}).exec()
		find_key.then((docs)=>{
			if(docs.length == 0){
				req.log.info("Cache miss");
				let insert_record = ()=>{
					data.value = Math.random().toString(36).substring(7)
					data.ttl = new Date()
					data.ttl.setMinutes(data.ttl.getMinutes()+config.cache_item_time_limit)				
					itemModel.create(data).then((err, idata)=> {
						response_utils.respondAndLog(req, res, status_codes.SUCCESS, {value:data.value}, {});
					}).catch(err=>{
						return next(err);
					})
				}
				itemModel.count({}).then(count=>{
					if(count >= config.cache_limit){
						itemModel.find({}).sort({ttl:1}).limit(1).exec((err,docs)=>{							
							itemModel.remove({key:docs[0].key}).exec(()=>{
								insert_record()
							})							
						})
					}else{
						insert_record()
					}
				})			
			}else{
				req.log.info("Cache hit");
				//If cache limit is reached we overwrite the Oldest Cache record
				if(Date.now() < docs[0].ttl){
					response_utils.respondAndLog(req, res, status_codes.SUCCESS, {value:docs[0].value}, {});
				}else{
					let new_cache_value = Math.random().toString(36).substring(7)
					let update_data = {}
					update_data.$set = {value:new_cache_value}
					update_data.$set.ttl = new Date().setMinutes(new Date().getMinutes()+config.cache_item_time_limit)
					itemModel.update(data,update_data,{}).then((update_result)=>{
							response_utils.respondAndLog(req, res, status_codes.SUCCESS, {value:new_cache_value}, {});
					}).catch(err=>{
						return next(err);
					})
				}
			}
		}).catch(err=>{
			return next(err);
		})

	}
}

let removeItem = (req, res, next)=> {
	let remove_query = {}
	if(req.params && req.params.key){
		remove_query.key = req.params.key
	}
	itemModel.remove(remove_query).exec(()=>{
		response_utils.respondAndLog(req, res, status_codes.SUCCESS, {}, {});
	})
}

exports.storeItem = storeItem;
exports.getItem = getItem;
exports.getAllItem = getAllItem;
exports.removeItem = removeItem;
