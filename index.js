var express = require('express');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var hbs = require('hbs');
var path = require('path');
var pug = require('pug');
var bcrypt = require('bcrypt');
// var {XMLHttpRequest} = require('xmlhttprequest');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/User.js');
var {Course} = require('./models/Course.js');

var admin = require('./routes/admin/admin.js');
var admincreate = require('./routes/admin/create.js');
var adminremove = require('./routes/admin/remove.js')
var userget = require('./routes/user/getendpoints.js')
var userpost = require('./routes/user/postendpoints.js')

var app = express();
var router=express.Router();

// app.use(express.static(path.join(__dirname, '/views/')));
app.set('view engine', 'pug');
app.set('view engine', 'hbs');
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

app.get('/logout', (req, res)=>{
  req.session.User = {
    privilege: 'guest',
    courses: [],
    user: 'Guest',
    pwd: 'password',
  };
  res.redirect('/');
});

app.get('/admin', admin);
app.get('/admin/create/notice', admin);
app.get('/admin/create/course', admin);
app.get('/admin/create/admin', admin);
app.post('/admin/create/course', admincreate);
app.post('/admin/create/notice', admincreate);
app.get('/admin/remove/notice', adminremove);
app.post('/admin/remove/notice/:name/:notice', adminremove);

app.get('/register', userget);
app.get('/profile', userget);
app.get('/profile/:name', userget);
app.get('/login', userget);
app.get('/courses', userget);
app.get('/courses/:id', userget);
app.get('/notices/:name', userget);
app.get('/coursecart', userget);

app.post('/register', userpost);
app.post('/login', userpost);
app.post('/coursecart', userpost);

app.listen(3000, ()=>{
  console.log("Check 3000");
});


// var http = new XMLHttpRequest();
// http.open("POST", "/coursecart", true);
// http.setRequestHeader("Content-type", "application/json");
// http.setRequestHeader("charset", "utf-8");
// http.onload = function(){
//   document.getElementById("#error").innerHTML="Success!!";
// }
// http.send({regid: id});
// console.log(http);
