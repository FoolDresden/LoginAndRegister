var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/User.js');

var createAdmin = function(){
  var admin = User({
    user: "admin",
    pwd: "password",
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
