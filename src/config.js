var config = {};

config.isloadFromFile = true;
config.htmlFilePath = './input/testcase.1.html';
config.fileEncoding = 'utf8';

config.rules = ['exists','notexists','morethan'];
config.rule = {};
config.rule.exists = {};
config.rule.notexists = {};
config.rule.morethan = {};
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
        'selector':'head title',
        'enable':true,
        'message':'This HTML without <title> tag'
    },
    {
        'selector':'head meta[name="descriptions"]',
        'enable':true,
        'message':'This HTML without <meta name="descriptions"> tag'
    },
    {
        'selector':'head meta[name="keywords"]',
        'enable':true,
        'message':'This HTML without <meta name="keywords"> tag'
    }];
config.rule.morethan.profiles = [
    {
        'selector':'strong',
        'compareTo':15,
        'enable':true,
        'message':'There are %i <img> tag without alt attribute'
    },
    {
        'selector':'h1',
        'compareto':1,
        'enable':true,
        'message':'There are %i <a> tag without rel attribute'
    }];
module.exports = config;