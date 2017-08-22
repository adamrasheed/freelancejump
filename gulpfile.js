const gulp              = require('gulp');
const plumber           = require('gulp-plumber');
const rename            = require('gulp-rename');

const autoprefixer      = require('gulp-autoprefixer');

const babel             = require('gulp-babel');


const concat            = require('gulp-concat');
const jshint            = require('gulp-jshint');
const uglify            = require('gulp-uglify');

const del               = require('del');


const sass              = require('gulp-ruby-sass');
const sassError         = require('gulp-sass-error');
const sourcemaps        = require('gulp-sourcemaps');


const notify            = require('gulp-notify');
const browserSync       = require('browser-sync');
const reload            = browserSync.reload;


const config = {
    buildFilesRemove: [
//        'build/scss/',
        'build/js/!(*.min.js)'
    ]
}

const path = {
    root: './build',
    
    style: {
        input: './app/**/*.scss',
        main: './app/scss/main.scss',
        output: './build/css'
    },
    
    script: {
        input: './app/css/**/*.scss',
        main: './app/js/main.js',
        output: './build/js'
    }
    
}

const src = {
    img:    'app/images/**/*',
    scss:   'app/css/**/*.scss',
    js:     'app/js/**/*.js',
    html:   'app/*.html'
}

const build = {
    root:  'build',
    img:   'build/image',
    css:   'build/css/',
    js:    'build/js'
}


//  BROWSERSYNC
gulp.task('browser-sync', function() {
    browserSync({
        server:{baseDir: './build/'}
    });
});

// log errors
function errorlog(err){
    console.error(err.message);
    this.emit('end');
}

// Images
gulp.task('images', function(){
    gulp.src(src.img)
    .pipe(gulp.dest(build.img))
});

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


//  SASS
gulp.task('sass', function() {
    return sass(src.scss, {style: 'compressed', sourcemap: true})
    .on('error', sass.logError)
    .pipe(plumber())
    .pipe(sourcemaps.write())
   .pipe(autoprefixer('last 2 versions'))
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


//  BUILD TASKS     //

//  Clean
gulp.task('build:clean', function(cb) {
    del(['build/**'], cb);
});

//  build directory of all files
gulp.task('build:copy', ['build:clean'], function(){
    return gulp.src('app/**/*')
    .pipe(gulp.dest(build.root))
});

// remove unwanted build files
gulp.task('build:remove', ['build:copy'], function(cb) {
    del(config.buildFilesRemove, cb)
});

// build task
gulp.task('build', ['build:copy', 'build:remove']);


//  WATCH
gulp.task('watch', function(){
    gulp.watch(src.img, ['images']);
    gulp.watch(src.js, ['scripts']);
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html, ['html']);
});


gulp.task('default', ['scripts', 'images', 'sass', 'html', 'browser-sync', 'watch']);
