'use strict';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { src, dest, task, series, parallel, watch } from 'gulp';
import plugins from 'gulp-load-plugins';
import { deleteAsync } from 'del';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import puppeteer from 'puppeteer';
import hasbin from 'hasbin';
import { url } from 'inspector';

// Core System
const projectFolder = "./project/";
const conf = JSON.parse(fs.readFileSync(projectFolder + 'build.json', 'utf8'));

// ESM Support for location and plugins
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gulpPlugins = plugins({ config: path.resolve(__dirname + '/package.json') });
const $ = {}
Object.keys(gulpPlugins).forEach(key => {
  let plugin = gulpPlugins[key]
  console.log([key, plugin, typeof plugin])
  if(typeof plugin == 'function') $[key] = plugin;
  else $[key] = plugin.default;
});

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
  return src(
    [
      srcPath + "/*.bamr" // BASIC AUTOMATED MARKUP REDUCTION
    ]
    ).pipe(
      $.flatmap( function(stream, file){
        // use flatmap plugin to gain file parameters
        return src(
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
        ).pipe( dest(file.dirname) );
      })
    );
}

// MINIFY CSS AND FUNNEL OUTPUT INTO SRC
function shrinkCSS() {
  return src(
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
      dest(function(file){
        return file.base
      })
    );
}

function shrinkJS() {
  return src(
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
      dest(function(file){
        return file.base;
      })
    );
}
function lintJS() {
  return src(
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
  return src(
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
    ).pipe( dest(buildPath) );
}

function copySPA(){
  return src(
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
      showFiles: true,
      showTotal: true
    })
  ).pipe( dest("./") )
}

function cleanFramework(){
  return deleteAsync([
      srcPath + "/*" + microStyle,
      frameworkPath + "/**/*" + microStyle,
      srcPath + "/*" + microScript,
      frameworkPath + "/**/*" + microScript,
      srcPath + "/*.html"
  ]);
}

function cleanBuild(){
  return deleteAsync([buildPath]);
}

function announceWatch(done){
    console.log();
    console.log(chalk.red("-- WATCHING SOURCE --"));
    console.log();
    done();
}

function srcWatcher() {
  return watch(
           srcPath + "/*.(bamr|js|css)",
           {ignoreInitial: false},
           series('build', announceWatch)
         );
}

// Puppeteering
async function renderAndSavePDF(done){
    // Chrome executable arguments - none needed as baseline
    const chromeArgs = {};
    // If chrome bin is over-ridden go ahead and use vs installed package
    if(chrome) chromeArgs.executablePath = chrome;

    await src(
      [
        buildPath + "/*.html"
      ]
    ).pipe(
      $.flatmap( function(stream, file){
        (async () => {
          // Try to launch a puppet
          let browser = await puppeteer.launch(chromeArgs);
          // Get a new page handle from puppet and set correct view size/scale
          const page = await browser.newPage();
          // Navigate puppet to SPA
          await page.goto( 'file://' + file.path );
          await page.pdf({
            path: file.path.replace('html', 'pdf'),
            format: "letter",
            printBackground: true,
            scale: conf.pdfScale
          });
          await browser.close();
        })()
        return stream;
      })
  );

  done();

}
// Gulp has no problem consuming an async function
task('render', series( renderAndSavePDF ));

task('deepClean', parallel(cleanFramework, cleanBuild));
task('make',
  series(
      series(lintJS),
      parallel(shrinkJS, shrinkCSS),
      series(craftSPA, copySPA)
  )
);
task('build', series('deepClean', 'make', cleanFramework, 'render'));
task('default', series('build'));
task('watch', series(srcWatcher));
