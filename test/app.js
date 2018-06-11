var fs = require('fs');
var scanner = require('./scanner');

// 1.load file which path set in config.js
scanner.run();
 
// 2.input readerStream to scanner
var readerStream = fs.createReadStream('./input/testcase.2.html');
scanner.run(readerStream);