'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var rimraf = require('rimraf');
var _ = require('lodash');

var paths = {
    libJsFiles: 'lib/**/*.js',
    specFiles: 'test/**/*.js',
    gulpfile: './gulpfile.js',
    eslintrc: './.eslintrc.json'
};

gulp.task('lint', function() {
    return gulp.src(paths.libJsFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', ['clean'], function(done) {

    var coverageVariable = '$$cov_' + new Date().getTime() + '$$';

    gulp.src(paths.libJsFiles)
        .pipe(istanbul({
            includeUntested: true,
            coverageVariable: coverageVariable
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(paths.specFiles)
                .pipe(mocha({reporter: 'spec'}))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov'],
                    coverageVariable: coverageVariable
                }))
                .on('end', done);
        });
});

gulp.task('clean', ['clean-coverage']);

gulp.task('clean-coverage', function (done) {
    rimraf('./coverage', done);
});

gulp.task('validate', ['lint', 'test']);

gulp.task('watch', function() {
    gulp.watch(_.flatten([
        paths.libJsFiles,
        paths.specFiles,
        paths.gulpfile
    ]), [
        'validate'
    ]);
    gulp.watch(paths.eslintrc, ['lint']);
});

gulp.task('dev', ['watch', 'validate']);
