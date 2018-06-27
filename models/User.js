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
  },
  privilege: {
    type: String,
    default: 'user',
  },
  courses: {
    type: Array,
    default: [],
  }
});

var User = mongoose.model('User', UserSchema);

module.exports={
  User,
}
