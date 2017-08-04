const gulp              = require('gulp');
const autoprefixer      = require('gulp-autoprefixer');
const plumber           = require('gulp-plumber');
const del               = require('del');
const sass              = require('gulp-sass');
const sassError         = require('gulp-sass-error');
const sourcemaps        = require('gulp-sourcemaps');
const rename            = require('gulp-rename');
const uglify            = require('gulp-uglify');
const babel             = require('gulp-babel');
const concat            = require('gulp-concat');
const jshint            = require('gulp-jshint');
const notify            = require('gulp-notify');
const browserSync       = require('browser-sync');
const reload            = browserSync.reload;


const src = {
    scss: 'app/scss/**/*.scss',
    js: 'app/js/**/*.js',
    html: 'app/*.html'
}

const build = {
    root: 'build',
    css: 'build/css',
    js: 'build/js'
}


process.env.NODE_ENV='development';

//  SCRIPTS

gulp.task('scripts', function(){
    return gulp.src(src.js)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(plumber())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(build.js))
    .pipe(notify('JS updated'))
    .pipe(reload({stream:true}));
});


gulp.task('sass', function(){
    return gulp.src(src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(build.css))
    .pipe(notify('Sass Compiled'))
    .pipe(reload({stream:true}));
});


//  HTML
gulp.task('html', function(){
    gulp.src(src.html)
    .pipe(gulp.dest(build.root))
    .pipe(notify('HTML updated'))
    .pipe(reload({stream:true}));
});


//  WATCH
gulp.task('watch', function(){
    gulp.watch(src.js, ['scripts']);
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html, ['html']);
});


//  Clean
gulp.task('clean', function(cb) {
    del([build.root], cb);
});


//  BROWSERSYNC
gulp.task('browser-sync', function() {
    browserSync({
        server:{baseDir: './build/'}
    });
});

//  Build
gulp.task('build',['clean','scripts', 'sass', 'html', 'browser-sync', 'watch'], function(){
    return gulp.src([src.scss, src.js, src.html], { base: './app'})
    .pipe(gulp.dest(build.root));
});

gulp.task('default', ['build']);
