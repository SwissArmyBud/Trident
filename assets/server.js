// COPYRIGHT PRESERVED THROUGH STACKOVERFLOW
// ORIGINAL LINK TO CONTENT: https://stackoverflow.com/a/29046869
// THE BELOW CODE HAS BEEN EDITED WITHOUT CLAIM TO NEW COPYRIGHT

var http = require('http');
var fs = require('fs');
var path = require('path');

var projectFolder = "./project/";
var conf = require( "." + projectFolder + "build.json" );

LISTENING_PORT = 8080;

var server = http.createServer(function (request, response) {
    console.log('[SRVR] - Request incoming...');

    var staticDir = projectFolder + conf.directories.build;
    var fileRequest;
    if (request.url == '/') {
        fileRequest = '/index.html';
    } else {
        // PREVENT TREE WALKING
        fileRequest = request.url;
        fileRequest.replace("../", "");
    }

    var filePath = staticDir + fileRequest;

    // ONLY SERVE SINGLE PAGE HTML APPLICATIONS
    var contentType = 'text/html';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                response.writeHead(404);
                response.end('404 - Oops can\'t find that...\n');
                response.end();
                console.log(`[SRVR] - No file available for ${fileRequest}...`);
            }
            else {
                response.writeHead(500);
                response.end('500 - Sorry, check with the site admin for error: '+error.code+'...\n');
                response.end();
                console.log('[SRVR] - Something broke:');
                console.log(error);
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
            console.log(`[SRVR] - Served ${fileRequest}...`);
        }
    });

});

console.log("*******ATTENTION*********");
console.log("*************************");
console.log();
console.log("THIS IS A ***DEVELOPMENT*** SERVER");
console.log();
console.log("DO NOT USE FOR PRODUCTION");
console.log("DO NOT LEAVE RUNNING WHEN NOT USING");
console.log("DO NOT CHANGE PORT NUMBER BELOW 512");
console.log("DO NOT WRITE HANDLERS THAT MODIFY FILES");
console.log("DO NOT CONNECT TO PRODUCTION SERVICES");
console.log();
console.log("DO USE IT TO QUICKLY SERVE STATIC FILES");
console.log()
console.log("*************************");
console.log()
console.log()

server.listen(LISTENING_PORT);
console.log(`Server running at http://127.0.0.1:${LISTENING_PORT}/`);
