var request = require("request");
var querystring = require("querystring")

var base_url = "http://localhost:3001/api/cache"

describe("All Cache Items API", function() {
     describe("GET /api/cache", function() {
         it("returns status code 200 and data must be array", function(done) {
             request.get(base_url, function(error, response, body) {
             expect(() => {
                JSON.parse(body);
             }).not.toThrow();
             expect(response.statusCode).toBe(200);
             var parsed_response = JSON.parse(body);
             expect(parsed_response.code).toBe(0);
             done();
         });
        });
    });
    var test_key = "test_key"
    describe("Testing api/cache", function() {
         it("returns status code 200 and create cache value", function(done) {
             var req_options = {}
             req_options.method = "POST"
             req_options.uri = base_url
             req_options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
             req_options.body = querystring.stringify({key:test_key, value:"XYSJFOA"})
             request(req_options, function(error, response, body) {
             // console.log(error,response,body)
             expect(response.statusCode).toBe(200);
             var parsed_response = JSON.parse(body);
             expect(parsed_response.code).toBe(0);
             done();
         });
        });        
         it("returns status code 200 and get cache value", function(done) {
             var test_url = base_url + "/"+test_key 
             request.get(test_url, function(error, response, body) {
             expect(response.statusCode).toBe(200);
             var parsed_response = JSON.parse(body);
             expect(parsed_response.code).toBe(0);
             done();
         });
        });
         it("returns status code 200 and remove cache value", function(done) {
             var test_url = base_url + "/"+test_key 
             request.delete(test_url, function(error, response, body) {
             expect(() => {
                JSON.parse(body);
             }).not.toThrow();
             expect(response.statusCode).toBe(200);
             var parsed_response = JSON.parse(body);
             expect(parsed_response.code).toBe(0);
             done();
         });
        });         
    });     
 })