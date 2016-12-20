var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache')
;


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("app/scss/**/*.scss")
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(gulp.dest("app/css"))
  .pipe(browserSync.stream());
});



// concatenate js files between 'build' comments
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});


// copy fonts
gulp.task('dist-fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
})

// copy css to dist
gulp.task('dist-css', function() {
  return gulp.src('app/css/**/*')
  .pipe(gulp.dest('dist/css'));
})

// optimize images and copy to dist
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  // Caching images that ran through imagemin
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/img'));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
  gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'])
    .pipe(gulp.dest('app/vendor'))

  gulp.src(['node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('app/vendor'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('fonts/font-awesome'))
})





// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'dist-css', 'dist-fonts', 'useref', 'images'], function() {

  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/scss/*.scss", ['sass', 'dist-css']);
  gulp.watch("app/*.html").on('change', browserSync.reload);
  gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
