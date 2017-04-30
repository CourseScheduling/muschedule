require('./models')

var URL = 'https://raw.githubusercontent.com/cobalt-uoft/datasets/master/courses.json'
// 'Borrowed' form UOT cobalt api.
// 
// 
// Follows JSON Structure:
// 
// {
//   "id":String,
//   "code":String,
//   "name":String,
//   "description":String,
//   "division":String,
//   "department":String,
//   "prerequisites":String,
//   "exclusions":String,
//   "level":Number,
//   "campus":String,
//   "term":String,
//   "breadths":[Number],
//   "meeting_sections":[{
//     "code":String,
//     "instructors":[String],
//     "times":[{
//       "day":String,
//       "start":Number,
//       "end":Number,
//       "duration":Number,
//       "location":String
//     }],
//     "size":Number,
//     "enrolment":Number
//   }]
// }
// from: https://github.com/cobalt-uoft/documentation/blob/master/endpoints/courses/README.md
// 
// 
// 
// Example:
// {
//  "id":"CSC148H1F20159",
//  "code":"CSC148H1F",
//  "name":"Introduction to Computer Science",
//  "description":"Abstract data types and data structures for implementing them. Linked data structures. Encapsulation and information-hiding. Object-oriented programming. Specifications. Analyzing the efficiency of programs. Recursion. This course assumes programming experience as provided by CSC108H1. Students who already have this background may consult the Computer Science Undergraduate Office for advice about skipping CSC108H1. Practical (P) sections consist of supervised work in the computing laboratory. These sections are offered when facilities are available, and attendance is required. NOTE: Students may go to their college to drop down from CSC148H1 to CSC108H1. See above for the drop down deadline.",
//  "division":"Faculty of Arts and Science",
//  "department":"Computer Science",
//  "prerequisites":"CSC108H1/(equivalent programming experience)",
//  "exclusions":"CSC150H1; you may not take this course after taking more than two CSC courses at the 200-level or higher",
//  "level":100,
//  "campus":"UTSG",
//  "term":"2015 Fall",
//  "meeting_sections":[
//    {
//      "code":"L0101",
//      "size":156,
//      "enrolment":0,
//      "times":[
//        {
//          "day":"MONDAY",
//          "start":10,
//          "end":11,
//          "duration":1,
//          "location":"RW 110"
//        },
//        {
//          "day":"WEDNESDAY",
//          "start":10,
//          "end":11,
//          "duration":1,
//          "location":"RW 110"
//        },
//        {
//          "day":"FRIDAY",
//          "start":10,
//          "end":11,
//          "duration":1,
//          "location":"RW 110"
//        }
//      ],
//      "instructors":[
//        "D Liu"
//      ]
//    },
//    {
//      "code":"L0201",
//      "size":156,
//      "enrolment":0,
//      "times":[
//        {
//          "day":"MONDAY",
//          "start":14,
//          "end":15,
//          "duration":1,
//          "location":"RW 117"
//        },
//        {
//          "day":"WEDNESDAY",
//          "start":14,
//          "end":15,
//          "duration":1,
//          "location":"RW 117"
//        },
//        {
//          "day":"FRIDAY",
//          "start":14,
//          "end":15,
//          "duration":1,
//          "location":"RW 117"
//        }
//      ],
//      "instructors":[
//        "D Liu"
//      ]
//    },
// From: https://github.com/cobalt-uoft/documentation/blob/master/endpoints/courses/show.md



// Download and parse the cobalt dataset
(function main () {
  downloadJSON(URL).then((contents) => {
    contents.forEach((course) => (parseCourse(course)))
  })
})()




// Actually does the parsing
function parseCourse (course) {
  var courseObj = new Course()
  // Grab everything trivial
  courseObj.code = course.code
  courseObj.name = course.name
  courseObj.description = course.description

  // Error checking in case bad data
  var termArr = course.term.split(' ')
  if (termArr.length >= 2) {
    courseObj.term = termArr[0]
    courseObj.year = termArr[1]
  }
} 







