var express = require('express');
var path = require('path');
var {mongoose} = require('../../db/mongoose.js');
var {User} = require('../../models/User.js');
var {Course} = require('../../models/Course.js');
var bcrypt = require('bcrypt');

var app = express();

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
      res.render(path.join(__dirname, '../../views/error.hbs'), {
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
        else {
          res.redirect('/');
        }
        // req.session.doc = doc;
        // console.log(req.session.doc);
        // res.set('text/plain').send("Success Login");
        // res.redirect('/');
        // console.log(user);
        // console.log(pwd);
        // res.send(doc);
        // res.redirect('/logged');
      }else {
        console.log('Error!! User not found');
        res.render(path.join(__dirname, '../../views/error.hbs'), {
          error: 'Please enter correct username and/or password'
        });
      }
    }else{
      console.log('Error!! User not found');
      res.render(path.join(__dirname, '../../views/error.hbs'), {
        error: 'Please enter correct username and/or password'
      });
    }
  }, (err)=>{
    res.send('Invalid');
  });
});

app.post('/coursecart', (req, res)=>{
  if(!req.session.User || req.session.User.privilege==='admin'){
    res.render(path.join(__dirname, '../../views/error.hbs'), {
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

module.exports = app;
