var ParseString = require('xml2js').parseString;
var Whoop = require('whoop')
var Request = require('request')
var Async = require('async')

function get_url(depth, year, term, dept, course) {
  return [
  `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?`,
  `sessyr=${year}&sesscd=${term}&output=5&req=${depth}&dept=${dept}&course=${course}`
  ].join('')
}



/**
 * DATA FORMAT:
 *
 * if no shit.
 * {
 *   depts: "/r/n"
 * }
 *
 * if stuff exists.
 * {
 *   depts: {
 *     dept: [
 *     {COURSE_OBJECT.}]
 *   }
 * }
 *
 * 
 */
// Main function to go on forever.
(function main () {
  // Ask for a term and for a year.
  year = Whoop('What Calender Year is it? ')
  term = Whoop('What Calender Term is it? {W,S,F}')

  // Alert me of what's going on.
  console.log('')
  console.log('Fetching from XML API.')

  // Start the waterfall of requests.
  Async.waterfall([
    (cb) => {
      Request(get_url(0, year, term), (err, resp, body) => {
        cb(null, body)
      })
    },
    (xml, cb) => {
      ParseString(xml, (err, json) => {
        cb(null, json)
      })
    }
  ], (err, result) => {
    if (result.depts && result.depts.dept) {
      var nums = result.depts.dept.length
      
      // This calender term is legit.
      console.log(`Initial Scan says there are ${nums} departments`)

      // Ask if we should start, else quit.
      var yn = Whoop('Do you want to commence the scraping, Enter y for yes.')

      // Start if it's a yes
      if (yn.toLowerCase() == 'y')
        start(result.depts.dept)

    } else {
      // This calendar term isn't legit.
      console.log('No, courses found, this seems like an invalid calendar term.')
      console.log('It might just be that this calendar term doesn\'t exist yet')
    }
  })
})()


