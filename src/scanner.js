const fs = require('fs');
const path = require('path');
const util = require('util');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const config = require('./config');

var scanner = {};

scanner.run = (inputReaderStream) => {
    var data;
    var readerStream;

    //init folder
    scanner.initFolder();

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

    console.log('Start parsing file %s', readerStream.path);
    readerStream.setEncoding(config.fileEncoding);
    readerStream.on('data', (line) => {
        data += line;
    });
    readerStream.on('end', () => {
        console.log('Parsing html file completed');
        if (data) {
            var dom = new JSDOM(data);  // 轉成dom object
            var checkResult = scanner.ruleValidate(dom.window.document);  // 檢核規則
            scanner.outputToFile(path.basename(readerStream.path), checkResult)
        }
    });     
    readerStream.on('error', (err) => {
        if (err.code == 'ENOENT') {
            console.error('Can not find file %s', err.path);
        }
    });
};

scanner.ruleValidate = (document) => {
    var result = '';
    try {
        config.rules.map((rule) => {
            // implemenet rule here
            if (rule == 'exists') {
                config.rule.exists.profiles.filter(scanner.isProfileEnable).map((profile) => {
                    var elementSize = document.querySelectorAll(profile.selector).length;
                    if (elementSize >= 1) result = scanner.logAndAppendToOutput(result, util.format(profile.message, elementSize));
                });
            } else if (rule == 'notexists') {
                config.rule.notexists.profiles.filter(scanner.isProfileEnable).map((profile) => {
                    var elementSize = document.querySelectorAll(profile.selector).length;
                    if (elementSize == 0) result = scanner.logAndAppendToOutput(result, util.format(profile.message));
                });
            } else if (rule == 'morethan') {
                config.rule.morethan.profiles.filter(scanner.isProfileEnable).map((profile) => {
                    var elementSize = document.querySelectorAll(profile.selector).length;
                    if (elementSize >= profile.compareTo) result = scanner.logAndAppendToOutput(result, util.format(profile.message, elementSize));
                });
            } else {
                console.warn('Rule %s needs to be implement', rule);
            }
        });
    } catch (e) {
        console.error(e);
    }
    return result;
};

scanner.isProfileEnable = (rule) => {
    return rule.enable;
};

scanner.outputToFile = (fileName, data) => {
    if (data) {
        var writerStream = fs.createWriteStream(util.format('%s%s_check_result.txt', config.outputFileFolder, fileName))
        writerStream.write(data, config.fileEncoding);
        writerStream.end();
        writerStream.on('finish', () => {
            console.log('Check result output to file %s%s_check_result.txt', config.outputFileFolder, fileName);
        })
    }
};

scanner.logAndAppendToOutput = (output, str) => {
    console.log(str);
    output += str + '\n';
    return output;
};

scanner.initFolder = () => {
    fs.stat(path.dirname(config.htmlFilePath), (err) => {
        if (err) fs.mkdir(path.dirname(config.htmlFilePath));
    })
    fs.stat(config.outputFileFolder, (err) => {
        if (err) fs.mkdir(config.outputFileFolder);
    })
};

module.exports = scanner;

if (require.main === module) {
    console.log('try to import this module and scanner.run()!');
}