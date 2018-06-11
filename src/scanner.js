const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const config = require('./config');

var scanner = {};

scanner.run = (inputReaderStream) => {
    var data = '';
    var readerStream;

    // 從config.htmlFilePath讀取檔案
    if (!inputReaderStream) {
        if (config.isloadFromFile) {
            readerStream = fs.createReadStream(config.htmlFilePath);
        } else {
            console.error('Please set config.isloadFromFile to true or input readerStream parameter');
        }
    } else {
        readerStream = inputReaderStream;
    }

    try {
        readerStream.setEncoding(config.fileEncoding);
        readerStream.on('data', (line) => {
            // console.log(line);
            data += line;
        });
        readerStream.on('error', (err) => {
           throw err;
        });
    } catch (e) {
        throw e;
    }

    var dom = new JSDOM(data);  // 轉成dom object
    scanner.ruleValidate(dom.window.document);  // 檢核規則
};

scanner.ruleValidate = (document) => {
    config.rules.map((rule) => {
        if (rule == 'exists') {
            config.rule.exists.profiles.filter(scanner.isProfileEnable).map((profile) => {
                var elementSize = document.querySelectorAll(profile.selector).length;
                if (elementSize >= 1) console.log(profile.message, elementSize);
            });
        } else if (rule == 'notexists') {
            config.rule.notexists.profiles.filter(scanner.isProfileEnable).map((profile) => {
                var elementSize = document.querySelectorAll(profile.selector).length;
                if (elementSize == 0) console.log(profile.message, elementSize);
            });
        } else if (rule == 'morethan') {
            config.rule.morethan.profiles.filter(scanner.isProfileEnable).map((profile) => {
                var elementSize = document.querySelectorAll(profile.selector).length;
                if (elementSize >= profile.compareTo) console.log(profile.message, elementSize);
            });
        } else {
            console.warn('Rule %s needs to be implement', rule);
        }
    });
};

scanner.loadConfig = () => {
    var config = require('./config');
    return config;
};

scanner.isProfileEnable = (rule) => {
    return rule.enable;
};

module.exports = scanner;