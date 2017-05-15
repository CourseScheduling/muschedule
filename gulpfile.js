var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

var files = [
  "./static/js/vue.js",
  "./static/js/mu.main.js",
  "./static/js/mu.model.js",
  "./static/js/mu.view.js",
  "./static/js/view/view.control.js",
  "./static/js/view/view.generate.js",
  "./static/js/view/view.schedule.js",
  "./static/js/util.js"
]

gulp.task('build', function () {
  return gulp.src(files)
  .pipe(uglify())
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./static/js'))
})