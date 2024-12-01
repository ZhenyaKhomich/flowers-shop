'use strict';
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');


function defaultTask() {
        return gulp.src(['src/css/style.scss', 'src/css/adaptive.scss'])
            .pipe(sass().on('error', sass.logError))
            .pipe(concat('style.css'))
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('dist/css'));
}

exports.default = defaultTask


exports.watch = function () {
   return gulp.watch('src/css/*.scss', gulp.series('default'));
};