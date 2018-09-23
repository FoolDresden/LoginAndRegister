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

var app = express();

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

app.post('/register', function(req, res){
  // console.log(req.body);
  var privilege;
  if(req.session.User.privilege==='admin')
  {
    privilege = 'admin';
  }else{
    privilege = 'user';
  }
  var salt = bcrypt.genSaltSync(2);
  var hash = bcrypt.hashSync(req.body.password, salt);
  var body = {
    user: req.body.username,
    pwd: hash,
    privilege,
  };
  User.create(body, function(err, doc){
    if(err){
      // console.log(err);
      res.render(path.join(__dirname, '/views/error.hbs'), {
        error: 'The username already exists. Pease pick a new one',
      });
      // return res.status(400).send(err);
    }else{
      // req.session.user = req.body.user;
      // req.session.pwd = req.body.pwd;
      req.session.User = doc;
      // res.send(doc);
      if(doc.privilege==='admin'){
        res.redirect('/admin');
      }else{
        res.redirect('/');
      }
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

app.get('/profile/:name', (req, res)=>{
  var name=req.body.name;
  User.findOne({name}).then((doc)=>{
    res.render(path.join(__dirname, '/views/logged.hbs'), {username: doc.name});
  });
});

app.post('/login', (req, res)=>{
  var user = req.body.username;
  // var pwd = bcrypt.compareSync(req.body.password, );
  // console.log(pwd);
  User.findOne({user}).then((doc)=>{
    if(doc){
      if(bcrypt.compareSync(req.body.password, doc.pwd))
      {
        console.log("Success login");
        req.session.User = doc;
        if(doc.privilege==='admin')
        {
          res.redirect('/admin');
        }
        // req.session.doc = doc;
        // console.log(req.session.doc);
        // res.set('text/plain').send("Success Login");
        res.redirect('/');
        // console.log(user);
        // console.log(pwd);
        // res.send(doc);
        // res.redirect('/logged');
      }else {
        console.log('Error!! User not found');
        res.render(path.join(__dirname, '/views/error.hbs'), {
          error: 'Please enter correct username and/or password'
        });
      }
    }else{
      console.log('Error!! User not found');
      res.render(path.join(__dirname, '/views/error.hbs'), {
        error: 'Please enter correct username and/or password'
      });
    }
  }, (err)=>{
    res.send('Invalid');
  });
});

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/login.html'))
});

app.post('/admin/create/course', (req, res)=>{
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
      console.log(regid);
      course.save().then((doc)=>{
        console.log(doc);
        res.redirect('/admin')
      }, (err)=>{
        res.render(path.join(__dirname, '/views/error.hbs'), {
          error: 'Course regid not unique',
        });
        // res.status(400).send(err);
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

app.get('/admin/create/course', (req, res)=>{
  if(!req.session.User || req.session.User.privilege!=='admin'){
      res.render(path.join(__dirname, '/views/error.hbs'), {
        error: "Need to admin access to add courses",
      });
      return;
    }
  res.sendFile(path.join(__dirname, '/views/addcourse.html'));
});

app.post('/coursecart', (req, res)=>{
  if(!req.session.User || req.session.User.privilege==='admin'){
    res.render(path.join(__dirname, '/views/error.hbs'), {
      error: "Need to user login to add courses",
    });
    return;
  }
  //urlencoded form data
  regid = req.body.regid;
  User.findOne({user: req.session.User.user}).then((doc)=>{
    if(doc){
      for(var i=0;i<doc.courses.length;i++){
        console.log("doc.courses.regid: ",doc.courses[i], regid);
        if(regid===doc.courses[i]){
          console.log("Didn't add");
          return;
        }
      }
      console.log(doc);
      doc.courses.push(regid);
      doc.save();
      res.send(doc.courses);
    }else{
      res.send("NOT FOUND");
    }
  }, (err)=>{
    res.status(400).send(err);
  })
});

app.get('/coursecart', (req, res)=>{
  if(!req.session.User || req.session.User.privilege==='admin' || req.session.User.privilege==='guest'){
    res.render(path.join(__dirname, '/views/error.hbs'), {
      error: "Need to user login to add courses",
    });
    return;
  }
  // res.send("Hi");
  var array=[];
  Course.find().then((doc)=>{
    // console.log("From backend:", doc);
    for(var i=0;i<doc.length;i++){
      array.push(doc[i].regid);
    }
    // console.log(array);
    var jsonData=`{"courses": "${array}"}`
    res.render(path.join(__dirname, '/views/coursecart.hbs'), {
      courses: array,
      user: req.session.User.user,
      func: function(){console.log(1)}
    });
  }, (err)=>{
    console.log("Error happened!!");
  });
});

app.get('/admin', (req, res)=>{
  if(req.session.User.privilege==='admin'){
    var user =[];
    var course=[];
    User.find().then((doc)=>{
      // console.log(doc);
      user = doc;
      // console.log(user);
      Course.find().then((doc2)=>{
        course = doc2;
        res.render(path.join(__dirname, '/views/admin.hbs'), {
          name: req.session.User.user,
          users: user,
          courses: course,
        });
      });
      // console.log(course);
    });
    // console.log("Second one\n");
    // console.log(user);
  }
  else {
    res.render(path.join(__dirname, '/views/error.hbs'), {
      error: 'Need admin access to view page'
    })
  }
});

app.post('/admin/create/admin', (req, res)=>{
  if(req.session.User.privilege==='admin')
  {
    var user = req.body.user;
    var pwd = req.body.pwd;
    var body = {
      user: req.body.username,
      pwd: req.body.password,
      privilege: 'admin',
    };
    User.create(body, function(err, doc){
      if(err){
        // console.log(err);
        res.render(path.join(__dirname, '/views/error.hbs'), {
          error: 'The username already exists. Pease pick a new one',
        });
        // return res.status(400).send(err);
      }else{
        res.redirect('/admin');
      }
    });
  }
});

app.get('/admin/create/admin', (req, res)=>{
  res.redirect('/register');
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
