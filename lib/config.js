// initial
var config = {};
config.rule = {};
/**
 * exists rule: if enable and exist element (query by selector) will throw message
 */
config.rule.exists = {};
/**
 * exists rule: if enable and not exist element (query by selector) will throw message
 */
config.rule.notexists = {};
/**
 * exists rule: if enable and find element (query by selector) count large than compareTo will throw message
 */
config.rule.morethan = {};

// file config
config.isloadFromFile = true;
config.htmlFilePath = './input/testcase.4.html';    // input file path
config.fileEncoding = 'utf8';   // input & output file encoding
config.outputFileFolder = './output/';  // output folder

// rules
config.rules = ['exists','notexists','morethan'];
config.rule.exists.profiles = [{
        'selector':'img:not([alt])',
        'enable':true,
        'message':'There are %i <img> tag without alt attribute'
    },
    {
        'selector':'a:not([rel])',
        'enable':true,
        'message':'There are %i <a> tag without rel attribute'
    }
];
config.rule.notexists.profiles = [{
        'selector':'title',
        'enable':true,
        'message':'This HTML without <title> tag'
    },
    {
        'selector':'meta[name="descriptions"]',
        'enable':true,
        'message':'This HTML without <meta name="descriptions"> tag'
    },
    {
        'selector':'meta[name="keywords"]',
        'enable':true,
        'message':'This HTML without <meta name="keywords"> tag'
    },
    {
        'selector':'meta[name="robots"]',
        'enable':false,
        'message':'This HTML without <meta name="keywords"> tag'
    }];
config.rule.morethan.profiles = [
    {
        'selector':'strong',
        'compareTo':15,
        'enable':true,
        'message':'This HTML have more than %i <img> tag without alt attribute'
    },
    {
        'selector':'h1',
        'compareTo':1,
        'enable':true,
        'message':'There are %i <a> tag without rel attribute'
    }];
module.exports = config;