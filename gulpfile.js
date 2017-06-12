const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('serve', () => {
  nodemon({
    script: 'app.js',
    ext: 'js jade coffee',
    stdout: false
  }).on('readable', function() {
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'serve'
]);
