var mongoose = require('mongoose')

var itemSchema = new mongoose.Schema({
  key:{
  	type:String,
  	required:true,
  	index: {unique: true, dropDups: true}
  },
  value:{
    type:String
  },
  ttl:{
  	type:Date,
  	index: true
  }
});

module.exports = mongoose.model('Item',itemSchema);
