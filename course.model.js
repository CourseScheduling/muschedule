var {model, Schema} = require('mongoose')


// The Schema for the individual section.
var SectionSchema = new Schema({
  uid: Number,
  course: String,
  code: String,
  uniq: String,
  prof: String,
  time: [Number],
  campus: String,
  status: String,
  comment: String
})


// This is the Schema for a single course.
var CourseSchema = new Schema({
  id: Number,
  name: String,
  tags: [String],
  description: String,
  dept: String,
  code: String,
  sections: [SectionSchema]
})


// We can access this model just by requiring this module.
global.Models.Course = model('Course', CourseSchema)
global.Models.Section = model('Section', SectionSchema)