const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

gulp.task('doc', function(done) {
  apidoc({
    src: 'src/',
    dest: 'doc/api'
  }, done);
});