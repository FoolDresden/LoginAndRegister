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
  if(!req.session.user){
    req.session.user = 'Guest';
  }
  res.render(path.join(__dirname, '/views/home.hbs'), {user: req.session.user});
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
      req.session.user = req.body.user;
      req.session.pwd = req.body.pwd;
      res.send(doc);
    }
  });

});

app.get('/register', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.get('/logged', (req, res)=>{
  console.log("Redirected to logged");
  console.log("req.session.user: ",req.session.user);
  res.render(path.join(__dirname, '/views/logged.hbs'), {username: req.session.user});
  // res.sendFile(path.join(__dirname, '/views/home.html'));
  console.log("Hi. After render");
});

app.post('/login', (req, res)=>{
  var user = req.body.user;
  var pwd = req.body.pwd;
  User.findOne({user, pwd}).then((doc)=>{
    if(doc){
      console.log("Success login");
      req.session.user = user;
      req.session.pwd = pwd;
      res.set('text/plain').send("Success Login");
      // console.log(user);
      // console.log(pwd);
      // res.send(doc);
      // res.redirect('/logged');
    }else{
      console.log('Error!! User not found');
    }
  }, (err)=>{
    res.send('Invalid');
  });
});

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/login.html'))
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
