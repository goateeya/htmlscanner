const fs = require('fs');
const path = require('path');
const util = require('util');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const config = require('./config');

class Scanner {
    constructor(readerStream) {
        if (readerStream != 'undefined') {
            this.readerStream = readerStream;
        }
    }

    run() {
        var data = '';

        this.initFolder();

        if (!this.readerStream) {
            if (config.isloadFromFile) {
                this.readerStream = fs.createReadStream(config.htmlFilePath);
            } else {
                console.error('Please set config.isloadFromFile to true or input readerStream parameter');
            }
        }

        // readerStream impl
        console.log('Start stream file %s', this.readerStream.path);
        this.readerStream.setEncoding(config.fileEncoding);
        this.readerStream.on('data', (chunk) => {
            data += chunk;
        });
        this.readerStream.on('end', () => {
            console.log('File streaming is end');
            if (data && data != '') {
                var dom = new JSDOM(data);  // 轉成dom object
                var checkResult = this.ruleValidate(dom.window.document);  // 檢核規則
                this.outputToFile(path.basename(this.readerStream.path), checkResult);
            }
        });     
        this.readerStream.on('error', (err) => {
            if (err.code == 'ENOENT') {
                console.error('Can not find file %s', err.path);
            }
        });
    }

    initFolder() {
        var inputFileFolder = path.dirname(config.htmlFilePath);
        var outputFileFolder = config.outputFileFolder;
        try {
            if (!fs.existsSync(inputFileFolder)) {
                fs.mkdirSync(inputFileFolder);
            }
        } catch (e) {
            console.error(e);
        }
        try {
            if (!fs.existsSync(outputFileFolder)) {
                fs.mkdirSync(outputFileFolder);
            }
        } catch (e) {
            console.error(e);
        }
    }

    ruleValidate(document) {
        var result = '';
        try {
            config.rules.map((rule) => {
                // implemenet rule here
                if (rule == 'exists') {
                    config.rule.exists.profiles.filter(this.isProfileEnable).map((profile) => {
                        var elementSize = document.querySelectorAll(profile.selector).length;
                        if (elementSize >= 1) result = this.logAndAppendToOutput(result, util.format(profile.message, elementSize));
                    });
                } else if (rule == 'notexists') {
                    config.rule.notexists.profiles.filter(this.isProfileEnable).map((profile) => {
                        var elementSize = document.querySelectorAll(profile.selector).length;
                        if (elementSize == 0) result = this.logAndAppendToOutput(result, util.format(profile.message));
                    });
                } else if (rule == 'morethan') {
                    config.rule.morethan.profiles.filter(this.isProfileEnable).map((profile) => {
                        var elementSize = document.querySelectorAll(profile.selector).length;
                        if (elementSize > profile.compareTo) result = this.logAndAppendToOutput(result, util.format(profile.message, elementSize));
                    });
                } else {
                    console.warn('Rule %s needs to be implement', rule);
                }
            });
        } catch (e) {
            console.error(e);
        }
        return result;
    }

    isProfileEnable(rule) {
        return rule.enable;
    }

    logAndAppendToOutput(output, str) {
        console.log(str);
        output += str + '\n';
        return output;
    }

    outputToFile(fileName, data) {
        if (data) {
            var writerStream = fs.createWriteStream(util.format('%s%s_check_result.txt', config.outputFileFolder, fileName))
            writerStream.write(data, config.fileEncoding);
            writerStream.end();
            writerStream.on('finish', () => {
                console.log('Check result output to file %s%s_check_result.txt', config.outputFileFolder, fileName);
            })
        }
    }
}

module.exports = Scanner;

if (require.main === module) {
    var scanner = new Scanner();
    scanner.run();
}