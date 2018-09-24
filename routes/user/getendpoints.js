var express = require('express');
var path = require('path');
var {mongoose} = require('../../db/mongoose.js');
var {User} = require('../../models/User.js');
var {Course} = require('../../models/Course.js');

var app = express();

app.get('/register', (req, res)=>{
  res.sendFile(path.join(__dirname, '../../views/register.html'));
});

app.get('/profile', (req, res)=>{
  console.log("Redirected to logged");
  console.log("req.session.user: ",req.session.User.user);
  res.render(path.join(__dirname, '../../views/logged.hbs'), {username: req.session.User.user});
  // res.sendFile(path.join(__dirname, '/views/home.html'));
  console.log("Hi. After render");
});

app.get('/profile/:name', (req, res)=>{
  var name=req.body.name;
  User.findOne({name}).then((doc)=>{
    res.render(path.join(__dirname, '../../views/logged.hbs'), {username: doc.name});
  });
});

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '../../views/login.html'))
});

app.get('/courses', (req, res)=>{
  if(!req.session.User || req.session.User.user==='Guest'){
    res.render(path.join(__dirname, '../../views/error.hbs'), {
      error: "Need to sign in to get courses page",
    });
    return;
  }
  User.findOne({user: req.session.User.user}).then((doc)=>{
    console.log("User found");
    // res.send(doc);
    res.render(path.join(__dirname, '../../views/registeredCourses.hbs'), {
      courses: doc.courses,
      username: req.session.User.user,
    });
  }, (err)=>{
    res.status(400).send(err);
  });
});

app.get('/courses/:id', (req, res)=>{
  Course.findOne({regid: req.params.id}).then((doc)=>{
    res.render(path.join(__dirname, '../../views/course.hbs'), {
      name: doc.name,
      regid: doc.regid,
      text: doc.text,
      credits: doc.credits,
    });
  }, (err)=>{
    res.send(err);
  });
});

app.get('/notices/:name', (req, res)=>{
  Course.findOne({name: req.params.name}).then((doc)=>{
    res.render(path.join(__dirname, '../../views/notices.hbs'), {
      name: doc.name,
      notices: doc.notices,
    });
  });
});

app.get('/coursecart', (req, res)=>{
  if(!req.session.User || req.session.User.privilege==='admin' || req.session.User.privilege==='guest'){
    res.render(path.join(__dirname, '../../views/error.hbs'), {
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
    res.render(path.join(__dirname, '../../views/coursecart.hbs'), {
      courses: array,
      user: req.session.User.user,
      func: function(){console.log(1)}
    });
  }, (err)=>{
    console.log("Error happened!!");
  });
});
module.exports = app;
