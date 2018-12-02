exports.create_error = function(message,obj,err){
    if(err)err.message = err.message + "\n" + message;
    else{
        err = new Error(message);
    }
    if(err.title == undefined){
        err.title = obj.title;
        err.code = obj.status;
        err.details = obj.message;
    }
    return err;
}