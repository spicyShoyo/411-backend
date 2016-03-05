'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel'),
watch = require('gulp-watch')

const sourcePath = ['{src,test}/**/*']
const sourceDest = gulp.dest('dist')

gulp.task('default', ['clean'], function() {
  return gulp.src(sourcePath)
  .pipe(babel({
    "presets": ["es2015", "stage-0"],
    "plugins": [  // TC39 is changing decorator syntax. We're using legacy.
      ["transform-decorators-legacy"],
    ]
  }))
  .pipe(sourceDest);
});

gulp.task('watch', function() {
  gulp.watch(sourcePath, ['default'])
});


gulp.task('build', ['clean'], function() {
  return gulp.src(sourcePath)
  .pipe(babel({
    "presets": ["es2015", "stage-0"],
    "plugins": [  // TC39 is changing decorator syntax. We're using legacy.
      ["transform-decorators-legacy"],
    ]
  }))
  .pipe(sourceDest);
});