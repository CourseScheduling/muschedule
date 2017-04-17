var gulp = require('gulp')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')

gulp.task('build', (cb) => {
  gulp.src('./static/js/*.js')
  .pipe(concat('bundle.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./assets/'))
})