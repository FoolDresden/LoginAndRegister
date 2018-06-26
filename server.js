var express = require('express');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var hbs = require('hbs');
var path = require('path');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/User.js');
var {Course} = require('./models/Course.js');

var app = express();

// app.use(express.static(path.join(__dirname, '/views/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'lala'}))
// var multipartMiddleware = multipart();

app.get('/', (req, res)=>{
  // res.send("Hi");
  // res.sendFile('./views/home.html');
  res.sendFile(path.join(__dirname, '/views/home.html'));
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
      // console.log(err);
      return res.status(400).send(err);
    }else{
      res.send(doc);
    }
  });

});

app.get('/register', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.post('/login', (req, res)=>{
  var user = req.body.user;
  var pwd = req.body.pwd;
  req.session.user = user;
  req.session.pwd = pwd;
  User.findOne({user, pwd}).then((doc)=>{
    if(doc){
      console.log("Success login");
      // console.log(user);
      // console.log(pwd);
      // res.send(doc);
    }else{
      res.send('Error');
    }
  }, (err)=>{
    res.send('Invalid');
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
