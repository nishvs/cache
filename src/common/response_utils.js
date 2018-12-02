exports.respondAndLog = (req,res,status_code,data,extra)=>{

    status_code = typeof status_code !== 'undefined' ? status_code : status_codes.FAILURE;
    data = typeof data !== 'undefined' ? data : {};
    extra = typeof extra !== 'undefined' ? extra : {};
    extra = extra != null ? extra : {};
    extra.requestId = req.requestId;
    let return_dict = {
        'message': status_code.message,
        'code': status_code.status,
        'body': data,
        'extra': extra
    };
    res.json(return_dict);
    let reqData = req.log_data || {};
    let lat = req.query.lat;
    let long = req.query.long;

    reqData.bodyParams = JSON.stringify(req.body || {});
    if(req.path != "/available/")reqData.queryParams = JSON.stringify(req.query || {});
    reqData.code = status_code.status;
    reqData.timeTaken = new Date - req.startTime;
    if(req.p && req.p.page && (req.p.page == 0) && req.dbStart){
        reqData.db_time = req.dbEnd - req.dbStart;
        reqData.after_db = new Date - req.dbEnd;
    }
    reqData.ips = JSON.stringify(req.ips || {});
    if((lat != undefined) && (long != undefined))reqData.deviceLocation = [parseFloat(long),parseFloat(lat)];
    req.log.info(reqData,"Responding for : ");
};