var express = require('express');
var path = require('path');
var {mongoose} = require('../../db/mongoose.js');
var {User} = require('../../models/User.js');
var {Course} = require('../../models/Course.js');

var app = express();

app.get('/admin/remove/notice', (req, res)=>{
  if(req.session.User.privilege==='admin')
  {
    Course.find().then((doc)=>{
       res.render(path.join(__dirname, '../../views/removeNotice.hbs'), {
         course: doc,
       })
    });
  }else {
    res.render(path.join(__dirname, '../../views/error.hbs'), {
      error: 'Need admin access',
    });
  }
});

app.post('/admin/remove/notice/:name/:notice', (req, res)=>{
  if(req.session.User.privilege==='admin')
  {
    console.log("Came to remove");
    var course = req.params.name;
    var notice = req.params.notice;
    // console.log(req.params);
    console.log(course);
    console.log(notice);
    // console.log(course.name);
    Course.findOne({name: course}).then((doc)=>{
      doc.notices.splice(doc.notices.indexOf(notice), 1);
      doc.save();
    });
    res.redirect('/admin/remove/notice');
  }
});

module.exports = app;
