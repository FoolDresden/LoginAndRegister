var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  user: {
    type: 'String',
    required: true,
    minlength: 3,
    trim: true,
    unique: true,
  },
  pwd: {
    type: 'String',
    required: true,
    minlength: 8,
  }
});

var User = mongoose.model('User', UserSchema);

module.exports={
  User,
}
