var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename');

var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var pixrem = require('gulp-pixrem');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify-es').default;
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');


var themePath = './wp-content/themes/<<theme>>';

var paths = {
  sassSrc: themePath + '/resources/sass/site.scss',
  sassDest: themePath + '/public/css',
  jsSrc: themePath + '/resources/js/',
  jsDest: themePath + '/public/js',
  imgSrc: themePath + '/resources/images/**/*.{png,jpg,gif}',
  imgDest: themePath + '/public/images',
  svgSrc: themePath + '/resources/images/**/*.svg',
  svgDest: themePath + '/public/images'
}

// var browsersList = ['last 5 versions', '> 5%', 'Firefox ESR'];

gulp.task('sass', function () {
  return gulp.src(paths.sassSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(autoprefixer({grid:true}))
    .pipe(pixrem())
    .pipe(csso())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.sassDest));
});

gulp.task('jslint',function() {
    return gulp.src(paths.jsSrc+'/**/*.js', { read: true })
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('js', function() {
  return gulp.src(paths.jsSrc+'/index.js', { read: true })
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(browserify({ transform: ['babelify'] }))
    .pipe(sourcemaps.init())
    .pipe(concat('site.js'))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.jsDest));
});


gulp.task('imagemin', function() {
  return gulp.src(paths.imgSrc)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.imgDest));
});


gulp.task('svgmin', function() {
  return gulp.src(paths.svgSrc)
    .pipe(svgmin())
    .pipe(gulp.dest(paths.svgDest));
});

gulp.task('vendor:css', function() {
  return gulp.src([
    './node_modules/normalize.css/normalize.css',
  ],{ read: true})
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(themePath + '/public/css/'));
});

gulp.task('vendor:js', function() {
  return gulp.src([
    ''
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(themePath + '/public/js/'));
});

//Watch files for change
gulp.task('watch', function() {
  gulp.watch(themePath + '/resources/sass/**/*.scss', gulp.series('sass'));
  gulp.watch(themePath + '/resources/js/**/*.js',  gulp.series('jslint','js'));
});

//
