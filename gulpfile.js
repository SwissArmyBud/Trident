'use strict';

const gulp = require('gulp');
const pkg = require('./package.json');
const $ = require('gulp-load-plugins')();
const del = require('del');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const exec = require('child_process').exec;
const puppeteer = require("puppeteer");
const hasbin = require('hasbin');

// Core System
const projectFolder = "./project/";
const conf = require( projectFolder + "build.json" );

// Puppeteer Setup
// Ensure chrome bin is in path or at provided or default location on system
// This will fail if using the installed package and puppets will ignore
const chrome = function(){
  try{
    // User provided
    if(conf.chromePath){ return conf.chromePath; }
    // Linux or PATH
    if(hasbin.sync('chrome')){ return 'chrome'; }
    // Windows default location
    const win32 = 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe';
    fs.accessSync(win32);
    return win32;
  } catch (error) {
    console.log();
    console.log(chalk.red("-- CAN'T FIND CHROME - NO PUPPET --"));
    console.log();
    return undefined;
  }
}();

// Include pathing
const normalizeSheet = conf.frameworks.normalize;
const styleSheet = conf.frameworks.style;
const jsFramework = conf.frameworks.javascript;

const srcPath = projectFolder + conf.directories.source;
const buildPath = projectFolder + conf.directories.build;
const frameworkPath = projectFolder + conf.directories.frameworks;
const staticPath = projectFolder + conf.directories.static;

// File format definitions
const html = ".html";
const microStyle = ".ms";
const microScript = ".mj";

console.log();
console.log();
console.log(chalk.cyan("[TRIDENT] --> Using the following settings:"));
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

console.log(chalk.cyan("[TRIDENT] --> Starting gulp run:"));
console.log();

function craftSPA() {
  return gulp.src(
    [
      srcPath + "/*.bamr" // BASIC AUTOMATED MARKUP REDUCTION
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
                  // First include sets variables
                  $.fileInclude({
                    context: {
                      // Core material
                      // (MINIFIED FORMATS in SRC FOLDER)
                      coreNS: '"../../' + frameworkPath + '/' + normalizeSheet + microStyle + '"',
                      coreSS: '"../../' + frameworkPath + '/' + styleSheet + microStyle + '"',
                      coreJS: '"../../' + frameworkPath + '/' + jsFramework + microScript + '"',
                      // Page-specific material
                      // (MINIFIED FORMATS in SPA FOLDER)
                      pageSS: '"./' + file.stem + '.ms"',
                      pageJS: '"./' + file.stem + '.mj"',
                    }
                  })
                ).pipe(
                  // Second include injects files from soruce
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
      srcPath + "/*.css",
      frameworkPath + "/*.css",
      "!" + srcPath + "/*.min.css"
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
      srcPath + "/*.js",
      frameworkPath + "/" + jsFramework + ".js",
      "!" + srcPath + "/*.min.js"
    ]
    ).pipe(
      $.size({
        title: "Original JS ",
        showFiles: true,
        showTotal: false
      })
    ).pipe(
      $.babel({
        presets: ['@babel/env']
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
      srcPath + "/*.js",
      "!" + srcPath + "/*.min.js"
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

function copySPA(){
  return gulp.src(
    [
      srcPath + "/*.html"
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
      srcPath + "/*" + microStyle,
      frameworkPath + "/**/*" + microStyle,
      srcPath + "/*" + microScript,
      frameworkPath + "/**/*" + microScript,
      srcPath + "/*.html"
  ]);
}

function delDist(){
  return del([buildPath]);
}

function announceWatch(done){
    console.log();
    console.log(chalk.red("-- WATCHING SOURCE --"));
    console.log();
    done();
}

function srcWatcher() {
  return gulp.watch(
           srcPath + "/*.(bamr|js|css)",
           {ignoreInitial: false},
           gulp.series('build', announceWatch)
         );
}

// Puppeteering
async function renderAndSavePDF(){
  // Path to dist folder
  const distPath = path.normalize(
                     path.join(
                       path.dirname(fs.realpathSync(__filename)),
                       path.join(buildPath)
                     )
                   );
  // Path to save the PDF to
  const outputPath = path.join(distPath, 'CurrentResume.pdf');

  // Chrome executable arguments - none needed as baseline
  const chromeArgs = {};
  // If chrome bin is over-ridden go ahead and use vs installed package
  if(chrome) chromeArgs.executablePath = chrome;

  // Try to launch a puppet
  let browser = await puppeteer.launch(chromeArgs);
  // Get a new page handle from puppet and set correct view size/scale
  const page = await browser.newPage();
  // Navigate puppet to resume
  await page.goto( path.join(distPath, 'resume.html') );
  await page.pdf({
    path: outputPath,
    format: "letter",
    printBackground: true,
    scale: conf.pdfScale
  });
  await browser.close();
}
// Gulp has no problem consuming an async function
gulp.task('render', gulp.series( renderAndSavePDF ));

gulp.task('deepClean', gulp.parallel(clean, delDist));
gulp.task('make',
  gulp.series(
      gulp.series(lintJS),
      gulp.parallel(shrinkJS, shrinkCSS),
      gulp.series(craftSPA, copySPA)
  )
);
gulp.task('build', gulp.series('deepClean', 'make', clean, 'render'));
gulp.task('default', gulp.series('build'));
gulp.task('watch', gulp.series(srcWatcher));
