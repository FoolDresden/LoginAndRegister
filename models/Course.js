var mongoose = require('mongoose');

var CourseSchema = mongoose.Schema({
  name:{
    required: true,
    minlength: 3,
    trim: true,
    type: String,
    unique: true,
  },
  credits: {
    required: true,
    type: Number,
  },
  regid: {
    required: true,
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
    default: 'No desc provided',
  },
  // regid: {
  //   type: String,
  //   trim: true,
  //   required: true,
  // },
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = {
  Course,
}
