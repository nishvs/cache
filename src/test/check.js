process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Item = require('../models/item.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Items', () => {
beforeEach((done) => { //Before each test we empty the database
    Item.remove({}, (err) => { 
       done();           
    });        
});
});

/*
* Test the /GET All Cache Items
*/
describe('/GET All Items', () => {
  it('it should GET all the cache items', (done) => {
    chai.request(server)
        .get('/api/cache')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
              res.body.data.should.be.eql(0);
          done();
        });
  });
});