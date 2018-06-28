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
  if(!req.session.User){
    req.session.User = {
      privilege: 'guest',
      courses: [],
      user: 'Guest',
      pwd: 'password',
    };
  }
  res.render(path.join(__dirname, '/views/home.hbs'), {user: req.session.User.user});
});

app.post('/register', function(req, res){
  console.log(req.body);
  var body = {
    user: req.body.user,
    pwd: req.body.pwd,
  };
  User.create(body, function(err, doc){
    if(err){
      // console.log(err);
      return res.status(400).send(err);
    }else{
      // req.session.user = req.body.user;
      // req.session.pwd = req.body.pwd;
      req.session.User = doc;
      res.send(doc);
    }
  });
});

app.get('/register', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.get('/profile', (req, res)=>{
  console.log("Redirected to logged");
  console.log("req.session.user: ",req.session.User.user);
  res.render(path.join(__dirname, '/views/logged.hbs'), {username: req.session.User.user});
  // res.sendFile(path.join(__dirname, '/views/home.html'));
  console.log("Hi. After render");
});

app.post('/login', (req, res)=>{
  var user = req.body.user;
  var pwd = req.body.pwd;
  User.findOne({user, pwd}).then((doc)=>{
    if(doc){
      console.log("Success login");
      req.session.User = doc;
      // req.session.doc = doc;
      // console.log(req.session.doc);
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
  if(!req.session.User || req.session.User.privilege==='guest'
    || req.session.User.privilege==='user'){
      res.render(path.join(__dirname, '/views/error.hbs'), {
        error: "Need to sign in to get courses page",
      });
      return;
    }else if(req.session.User.privilege==='admin'){
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
    }
});

app.get('/courses', (req, res)=>{
  if(!req.session.User || req.session.User.user==='Guest'){
    res.render(path.join(__dirname, '/views/error.hbs'), {
      error: "Need to sign in to get courses page",
    });
    return;
  }
  User.findOne({user: req.session.User.user}).then((doc)=>{
    console.log("User found");
    // res.send(doc);
    res.render(path.join(__dirname, '/views/registeredCourses.hbs'), {
      courses: doc.courses,
      username: req.session.User.user,
    });
  }, (err)=>{
    res.status(400).send(err);
  });
});

app.get('/courses/:id', (req, res)=>{
  Course.findOne({regid: req.params.id}).then((doc)=>{
    res.render(path.join(__dirname, '/views/course.hbs'), {
      name: doc.name,
      regid: doc.regid,
      text: doc.text,
      credits: doc.credits,
    });
  }, (err)=>{
    res.send(err);
  });
});


app.listen(3000, ()=>{
  console.log("Check 3000");
});
