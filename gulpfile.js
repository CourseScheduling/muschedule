var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var async = require('async')

gulp.task('build', cb => {

  async.parallel([
    cb => {
      // This is for the css.
      
    },
    cb => {
      // This if for the js.

    }
  ],
  function end(err,results) {
    if (err) {
      console.err('Error', err)
      return
    }
    
    cb(results)
  })

  gulp.src(files)
  .pipe(uglify())
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./static/js'))
})