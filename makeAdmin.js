var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/User.js');
var bcrypt = require('bcrypt');

var createAdmin = function(){
  var password = bcrypt.hashSync("password", 2);
  var admin = User({
    user: "admin",
    pwd: password,
    privilege: "admin",
  });
  admin.save().then((doc)=>{
    console.log(doc);
  }, (err)=>{
    console.log(err);
  });
}

console.log("Making an admin...");
createAdmin();
