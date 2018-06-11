var fs = require('fs');
var scanner = require('./scanner');

// scanner.run();
var readerStream = fs.createReadStream('./testcase.2');
scanner.run(readerStream);