var gulp       = require('gulp'),
    changed    = require('gulp-changed'),
    clean      = require('gulp-clean'),
    concat     = require('gulp-concat'),
    rename     = require('gulp-rename'),
    header     = require('gulp-header'),
    jshint     = require('gulp-jshint'),
    uglify     = require('gulp-uglify'),
    karma      = require('gulp-karma'),
    stylish    = require('jshint-stylish'),
    http       = require('http'),
    connect    = require('connect');

// package config
var pkg = require('./package.json');

// banner
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

// paths
var dirs = {
    src: './src',
    dist: './dist',
    test: './test',
    bower: './bower_components'
};

var paths = {
    scripts: [dirs.src + '/**/*.js'],
    tests: [dirs.test + '/**/*-spec.js'],

    cleanup: [
        dirs.dist + '/**/*.*',
        '!' + dirs.dist + '/vendors/**/*.*'
    ]
};


// cleanup task
gulp.task('cleanup', function() {
    return gulp.src(paths.cleanup, {read: false})
        .pipe(clean({force: true}));
});

// lint task
gulp.task('lint', function() {
    return gulp.src([].concat(paths.scripts, paths.tests))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// concatenate and minify js
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(changed(dirs.dist))
        .pipe(header(banner, {pkg : pkg}))
        // .pipe(uglify({
        //     preserveComments: 'some',
        //     outSourceMap: false
        // }))
        .pipe(gulp.dest(dirs.dist));
});


// watch files for changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
});


// source code tests
gulp.task('test', function() {
    return gulp.src('./Try not. Do or do not. There is no try.')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }));
});


// static file server
gulp.task('server', function() {
    var port = 8888,
        server;

    server = connect()
        .use(connect.timeout())
        .use(connect.logger('dev'))
        .use(connect.static(__dirname + '/' + dirs.dist));

    http.createServer(server).listen(port, function() {
        console.log('Static server listening on port %d', port);
    });
});



// composite tasks
gulp.task('default', ['cleanup'], function() {
    return gulp.start('scripts', 'watch');
});

gulp.task('build', ['cleanup'], function() {
    return gulp.start('scripts');
});