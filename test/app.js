var fs = require('fs');
// var scanner = require('../lib/scanner.js');
var Scanner = require('../lib/newscanner.js');

// 1.load file which path set in config.js
// scanner.run();
 
// 2.input readerStream to scanner
// var readerStream = fs.createReadStream('./input/testcase.2.html');
// var data = scanner.run(readerStream);
// console.log(1 + data);

// 3.use newscanner
var scanner = new Scanner();
scanner.run();