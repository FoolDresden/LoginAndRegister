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
    unique: true,
    required: true,
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
    default: 'No desc provided',
  },
  notices: {
    type: [{type: String}],
    default: [],
  }
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
