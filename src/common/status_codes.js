module.exports = {
    "SUCCESS":{
        "status":0,
        "title":"Success",
        "message":"Success"
    },
    "FAILURE": {
        "status": 1,
        "title":"App Error",
        "message": "Internal Server Error. API failed"
    },
    "NOT_FOUND": {
        "status": 404,
        "title":"Not Found",
        "message": "API Url not found on server"
    },
    "REQUIRED_PARAMETER_MISSING" :{
        "status": 2,
        "title":"App Error",
        "message": "A required parameter is missing"
    }
}
