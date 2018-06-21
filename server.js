var express = require('express');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var express-session = require('express-session');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/User.js');
var {Course} = require('./models/Course.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var multipartMiddleware = multipart();

app.get('/', (req, res)=>{
  res.send("Hi");
});

app.post('/register', function(req, res){
  // var username = req.username;
  // var password = req.password;
  console.log(req.body);
  var body = {
    user: req.body.user,
    pwd: req.body.pwd,
  };
  // var user = User(body);

  // user.save().then((doc)=>{
  //   console.log(doc);
  // }, (err)=>{
  //   console.log(err);
  // });

  User.create(body, function(err, doc){
    if(err){
      return res.status(400).send(err);
    }else{
      res.send(doc);
    }
  });

});

app.post('/courses', (req, res)=>{
  var name = req.body.name;
  var credits = req.body.credits;
  var text = req.body.text;
  var regid = req.body.regid;
  var course = Course({
    name,
    credits,
    text,
    regid,
  });
  course.save().then((doc)=>{
    res.send(doc);
  }, (err)=>{
    res.status(400).send(err);
  });
});

app.get('/courses', (req, res)=>{
  Course.find().then((docs)=>{
    res.send(docs);
  }, (err)=>{
    res.status(400).send(err);
  });
});

app.listen(3000, ()=>{
  console.log("Check 3000");
});
