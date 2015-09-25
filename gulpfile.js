"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs a local dev server
var open = require('gulp-open'); // Open a URL in a web browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); // Concatenates files
var lint = require('gulp-eslint'); // Lint JS files, including JSX

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html', // go into the src directory and match any html files
        js: './src/**/*.js', // look for any js we can find, including in subdirectories
        images: './src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.js'
    }
}

// Start a local development server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    })
});

gulp.task('open', ['connect'], function() { // reference the dependent tasks - e.g.run connect first
   gulp.src('dist/index.html')
       .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function () {
    gulp.src(config.paths.html) // go get any html files, put them in the destination dist and then reload using connect
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function () {
   browserify(config.paths.mainJs)
       .transform(reactify) // transform any js we get using reactify - reactify compiles our jsx
       .bundle()// bundle all js files into one and save on http requests, loading time
       .on('error', console.error.bind(console)) // pass any errors to the console
       .pipe(source('bundle.js')) // name our bundle
       .pipe(gulp.dest(config.paths.dist + '/scripts')) // define the destination of our bundle
       .pipe(connect.reload()); // if we change any js reload
});

gulp.task('css', function () { // css task that looks for our css paths, concatenate into bundle.css, and push to dist/css
   gulp.src(config.paths.css)
       .pipe(concat('bundle.css'))// bundle all of our css into one file, bundle.css
       .pipe(gulp.dest(config.paths.dist + '/css'));
});

// Migrates images to dist folder
// Note that I could even optimize my images here
gulp.task('images', function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());
});


gulp.task('lint', function () { // return the results so we see the output of our linting
    return gulp.src(config.paths.js) // we're looking at js files
        .pipe(lint({config: 'eslint.config.json'})) // configuration file of linting rules
        .pipe(lint.format());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']); // watch the html path and anytime something changes in there run the html task
    gulp.watch(config.paths.js, ['js', 'lint']); // watch the js path and anytime js changes run the js and linting tasks
});

gulp.task('default', ['html', 'js', 'css', 'images', 'lint', 'open', 'watch']); // if I just type gulp it's going to run the html task and then the open and watch tasks