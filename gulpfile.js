'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var $ = require('gulp-load-plugins')();
var del = require('del');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

// Core Styles
var projectFolder = "./project/";
var conf = require( projectFolder + "build.json" );
var normalizeSheet = conf.frameworks.normalize;
var styleSheet = conf.frameworks.style;
var jsFramework = conf.frameworks.javascript;

var srcPath = projectFolder + conf.directories.source;
var buildPath = projectFolder + conf.directories.build;
var frameworkPath = projectFolder + conf.directories.frameworks;
var staticPath = projectFolder + conf.directories.static;

var html = ".html";
var microStyle = ".ms";
var microScript = ".mj";

console.log();
console.log();
console.log(chalk.cyan("[ESPALIF] --> Using the following settings:"));
console.log();
console.log(chalk.red("-- LOCATIONS --"));
console.log("BAMR Source Path:", chalk.cyan(srcPath));
console.log("Frameworks Path:", chalk.cyan(frameworkPath));
console.log("SPA Output Path:", chalk.cyan(buildPath));
console.log();
console.log(chalk.red("-- FRAMEWORKS --"));
console.log("CSS Normalize:", chalk.cyan(normalizeSheet));
console.log("CSS Framework:", chalk.cyan(styleSheet));
console.log("JS Framework:", chalk.cyan(jsFramework));
console.log();
console.log();

if(!(
  normalizeSheet && styleSheet && jsFramework &&
  srcPath && frameworkPath && buildPath && staticPath
)){
  throw new Error("Parameters missing from build.conf!");
}

console.log(chalk.cyan("[ESPALIF] --> Starting gulp run:"));
console.log();

function craftSPA() {
  return gulp.src(
    [
      srcPath + "/*/*.bamr" // BASIC AUTOMATED MARKUP REDUCTION
    ]
    ).pipe(
      $.tap( function(file){
        // use tap to gain file parameters
        return  gulp.src(
                  file.path
                ).pipe(
                  $.size({
                    title: "Starting BAMR --> ",
                    showFiles: true,
                    showTotal: false
                  })
                ).pipe(
                  $.fileInclude({
                    context: {
                      // Core material
                      // (MINIFIED FORMATS in SRC FOLDER)
                      coreNS: '"../../../' + frameworkPath + '/' + normalizeSheet + microStyle + '"',
                      coreSS: '"../../../' + frameworkPath + '/' + styleSheet + microStyle + '"',
                      coreJS: '"../../../' + frameworkPath + '/' + jsFramework + microScript + '"',
                      // Page-specific material
                      // (MINIFIED FORMATS in SPA FOLDER)
                      pageSS: '"./' + file.stem + '.ms"',
                      pageJS: '"./' + file.stem + '.mj"'
                    }
                  })
                ).pipe(
                  $.fileInclude()
                ).pipe(
                  $.htmlmin({
                    collapseWhitespace: true
                  })
                ).pipe(
                  $.rename(function (path) {
                    path.extname = html;
                  })
                ).pipe(
                  $.size({
                    title: "Finished SPA  --> ",
                    showFiles: true,
                    showTotal: false
                  })
                ).pipe( gulp.dest(file.dirname) );
      })
    );
}

// MINIFY CSS AND FUNNEL OUTPUT INTO SRC
function shrinkCSS() {
  return gulp.src(
    [
      srcPath + "/**/*.css",
      frameworkPath + "/" + normalizeSheet + ".css",
      frameworkPath + "/" + styleSheet + ".css",
      "!" + srcPath + "/**/*.min.css"
    ]
    ).pipe(
      $.size({
        title: "Original CSS",
        showFiles: true,
        showTotal: false
      })
    ).pipe(
      $.cleanCss()
    ).pipe(
      $.rename(function (path) {
        path.extname = microStyle;
      })
    ).pipe(
      $.size({
        title: "Minified -> ",
        showFiles: true,
        showTotal: false
      })
    ).pipe(
      gulp.dest(function(file){
        return file.base
      })
    );
}

function shrinkJS() {
  return gulp.src(
    [
      srcPath + "/**/*.js",
      frameworkPath + "/" + jsFramework + ".js",
      "!" + srcPath + "/**/*.min.js"
    ]
    ).pipe(
      $.size({
        title: "Original JS ",
        showFiles: true,
        showTotal: false
      })
    ).pipe(
      $.uglify()
    ).pipe(
      $.rename(function (path) {
        path.extname = microScript;
      })
    ).pipe(
      $.size({
        title: "Minified -> ",
        showFiles: true,
        showTotal: false
      })
    ).pipe(
      gulp.dest(function(file){
        return file.base;
      })
    );
}
function lintJS() {
  return gulp.src(
    [
      srcPath + "/**/*.js",
      "!" + srcPath + "/**/*.min.js"
    ]
    ).pipe(
      $.jshint()
    ).pipe(
      $.jshint.reporter('default')
    );
}

function copyStatic(){
  return gulp.src(
    [
      staticPath + "/**/*.*"
    ]
    ).pipe(
      $.size({
        title: "Static Asset --> ",
        showFiles: true,
        showTotal: false
      })
    ).pipe(
      $.size({
        title: "Static Assets:",
        showFiles: false,
        showTotal: true
      })
    ).pipe( gulp.dest(buildPath) );
}

function sizeReport(){
  return gulp.src(
    [
      buildPath + "/**/*.*"
    ]
    ).pipe(
      $.size({
        title: "Distributable Size:",
        showFiles: false,
        showTotal: true
        })
    );
}


function copySPA(){
  return gulp.src(
    [
      srcPath + "/**/*.html"
    ]
    ).pipe(
      // GLOBS move folder, must rename `dirname` prop to buildPath
      $.rename(function (path) {
        path.dirname = buildPath;
      })
    ).pipe(
      $.size({
        title: "Single Page Applications:",
        showFiles: false,
        showTotal: true
      })
    ).pipe( gulp.dest("./") );
}

function clean(){
  return del([
      srcPath + "/**/*" + microStyle,
      frameworkPath + "/**/*" + microStyle,
      srcPath + "/**/*" + microScript,
      frameworkPath + "/**/*" + microScript,
      srcPath + "/**/*.html"
  ]);
}

function delDist(){
  return del([buildPath]);
}

function announceWatch(cb){
  setTimeout(function(){
    console.log();
    console.log(chalk.red("-- WATCHING SOURCE --"));
    console.log();
  }, 100);
  cb();
}

function srcWatcher() {
  return gulp.watch(
             srcPath + "/**/*.(bamr|js|css)",
           {ignoreInitial: false},
           gulp.series('build', announceWatch)
         );
}

gulp.task('deepClean', gulp.parallel(clean, delDist));
gulp.task('make',
  gulp.series(
      gulp.series(lintJS),
      gulp.parallel(shrinkJS, shrinkCSS),
      gulp.series(craftSPA, copySPA, copyStatic, sizeReport)
  )
);
gulp.task('build', gulp.series("deepClean", "make", clean));
gulp.task('make', gulp.series("make"));
gulp.task('copyStatic', gulp.series(copyStatic));
gulp.task('default', gulp.series("build"));
gulp.task('watch', gulp.series(srcWatcher));
