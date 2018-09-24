var express = require('express');
var path = require('path');
var {mongoose} = require('../../db/mongoose.js');
var {User} = require('../../models/User.js');
var {Course} = require('../../models/Course.js');

var app = express();

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
        res.render(path.join(__dirname, '../../views/admin.hbs'), {
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
    res.render(path.join(__dirname, '../../views/error.hbs'), {
      error: 'Need admin access to view page'
    })
  }
});



app.get('/admin/create/admin', (req, res)=>{
  res.redirect('/register');
});

app.get('/admin/create/notice', (req, res)=>{
  if(req.session.User.privilege==='admin')
  {
    Course.find().then((doc)=>{
      // console.log(doc);
      res.render(path.join(__dirname, '../../views/addnotices.hbs'), {
        courses: doc,
      });
    });
  }else{
    res.render(path.join(__dirname, '../../views/error.hbs'), {
      error: 'Need admin access',
    });
  }
});

app.get('/admin/create/course', (req, res)=>{
  if(!req.session.User || req.session.User.privilege!=='admin'){
      res.render(path.join(__dirname, '../../views/error.hbs'), {
        error: "Need to admin access to add courses",
      });
      return;
    }
  res.sendFile(path.join(__dirname, '../../views/addcourse.html'));
});




module.exports = app;
