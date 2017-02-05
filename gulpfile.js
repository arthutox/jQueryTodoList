'use strict';
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rigger = require('gulp-rigger'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    del = require('del');

var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    app: {
        pug: 'app/*.pug',
        js: 'app/js/**/*.js',
        jsSource:  'app/js/',
        sass: 'app/sass/*.sass',
        img: 'app/img/**/*.*'
    },
    watch: {
        pug: 'app/**/*.pug',
        js: 'app/js/**/*.js',
        sass: 'app/sass/**/*.sass',
        img: 'app/img/**/*.*'
    },
    bowerComponents : 'bower_components/'
};
/*--------------------------------------------------------------
 images files
 --------------------------------------------------------------*/
gulp.task('img:dist', function () {
    return gulp.src([
            path.app.img
        ])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img));
});
/*--------------------------------------------------------------
 style files
 --------------------------------------------------------------*/
//Sass compilation etc...
gulp.task('bower-css-libs:app', function () {
    var themeName = 'base';
    return gulp.src([
            path.bowerComponents + 'jquery-ui/themes/' + themeName + '/core.css',
            path.bowerComponents + 'jquery-ui/themes/' + themeName + '/datepicker.css',
            path.bowerComponents + 'jquery-ui/themes/' + themeName + '/theme.css',
            path.bowerComponents + 'jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css'
        ])
        .pipe( gulp.dest(path.dist.css + 'css-libs/') );
});
gulp.task('sass:app:dist',['bower-css-libs:app'], function(){
    return gulp.src(path.app.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie 9'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps-files'))
        .pipe(gulp.dest(path.dist.css));
});
/*--------------------------------------------------------------
 javascript files
 --------------------------------------------------------------*/
//find js libs in bower for app dir
gulp.task('bower-js-libs:app', function () {
    return gulp.src([
                path.bowerComponents + 'jquery/dist/jquery.min.js',
                path.bowerComponents + 'jquery-ui/jquery-ui.min.js',
                path.bowerComponents + 'jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.js'
           ])
           .pipe( gulp.dest(path.dist.js + '/vendor') );
});
gulp.task('js:dist',['bower-js-libs:app'], function () {
    return gulp.src([
            path.app.js
        ])
        //.pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
});
/*--------------------------------------------------------------
 html files
 --------------------------------------------------------------*/
gulp.task('pug:dist', function(){
    return gulp.src(path.app.pug)
        .pipe(pug({
            pretty: true,
            compileDebug: true
        }))
        .pipe(gulp.dest(path.dist.html));
});
/*--------------------------------------------------------------
 watch task
 --------------------------------------------------------------*/
gulp.task('watch', function() {
    watch([path.watch.sass], function() {
        gulp.start('sass:app:dist');
    });
    watch([path.watch.js], function() {
        gulp.start('js:dist');
    });
    watch([path.watch.pug], function() {
        gulp.start('pug:dist');
    });
    watch([path.watch.img], function() {
        gulp.start('img:dist');
    });

});
/*--------------------------------------------------------------
 webserver task
 --------------------------------------------------------------*/
gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            open: false,
            port: 8080
        }));
});
/*--------------------------------------------------------------
 clean task
 --------------------------------------------------------------*/
gulp.task('clean', function() {
    return del(['dist/*']);
});
/*--------------------------------------------------------------
 gulp def task
 --------------------------------------------------------------*/
gulp.task('default', function(){
    runSequence('clean','sass:app:dist','js:dist','pug:dist','img:dist','watch','webserver')
});
