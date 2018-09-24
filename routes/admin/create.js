var express = require('express');
var path = require('path');
var {mongoose} = require('../../db/mongoose.js');
var {User} = require('../../models/User.js');
var {Course} = require('../../models/Course.js');

var app = express();

app.post('/admin/create/notice', (req, res)=>{
  if(req.session.User.privilege==='admin')
  {
    console.log(req.body.course);
    Course.findOne({name: req.body.course}).then((doc)=>{
      // if(doc)
      doc.notices.push(req.body.text);
      doc.save();
      res.redirect('/admin');
      // console.log(doc);
    }, (err)=>{
      res.status(400).send(err);
    });
  }
  else {
    res.render(path.join(__dirname, '../../views/error.hbs'), {
      error: 'Need admin access',
    });
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
        res.render(path.join(__dirname, '../../views/error.hbs'), {
          error: 'The username already exists. Pease pick a new one',
        });
        // return res.status(400).send(err);
      }else{
        res.redirect('/admin');
      }
    });
  }
});

app.post('/admin/create/course', (req, res)=>{
  if(!req.session.User || req.session.User.privilege==='guest'
    || req.session.User.privilege==='user'){
      res.render(path.join(__dirname, '../../views/error.hbs'), {
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
        res.render(path.join(__dirname, '../../views/error.hbs'), {
          error: 'Course regid not unique',
        });
        // res.status(400).send(err);
      });
    }
});

module.exports = app;
