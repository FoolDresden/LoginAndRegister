var http = new XMLHttpRequest();
jQuery("#submit").click(function (e){
  console.log("Submitted");
  var name = jQuery("[name=username]").val();
  var pwd = jQuery("[name=password]").val();
  var body = {
    name,
    pwd,
  };
  http.open("POST", "/register", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send(body);
});
console.log("Loaded");


















// var {app} = require('../../../server.js');
//
// register = function(){
//
// }
