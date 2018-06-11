# htmlscanner
a scanner for checking html

安裝方式  
--
1.git clone https://github.com/goateeya/htmlscanner.git  
2.cd htmlscanner/  
3.npm install  
4.node test/app.js  
  
介接/使用方式  
--  
1. var scanner = require('scanner');  
scanner.run();  
  
2. var scanner = require('scanner');  
var readerStream = fs.createReadStream('xxxxx.html');  
scanner.run(readerStream);  
執行後會產出檔案於./output/xxxxx.html_check_result.txt (預設產出路徑為./output/)  
  
Configure  
--
First open src/config.js  

config.isloadFromFile = true;  
是否讀取檔案，但如果run function傳入readerStream，會優先使用傳入的readerStream  
  
config.htmlFilePath = 'F:/git/repo/htmlscanner/input/testcase.4.html';  
本機html檔案位置  
  
config.fileEncoding = 'utf8';  
檔案encoding編碼  
  
config.outputFileFolder = './output/';  
產出結果檔案路徑  
  
config.rules = ['exists','notexists','morethan'];  
會執行的rule，實作於scanner.js中的function scanner.ruleValidate()  
  
config.rule.xxxxx.profiles  
xxxxx表示rule name，其中profiles下有4個attribute  
selector: CSS selector用來抓取dom物件  
enable: profile啟用flag  
message: 符合條件會拋出的訊息  
compareTo: 元素數量比對基準
  
Rule說明  
--
exists  
html存在至少一個元素，則符合條件，並彈出message  
  
notexists  
html不存在元素，則符合條件，並彈出message  
  
morethan  
html中元素大於compareTo的數字，，則符合條件，並彈出message  
  
如何新增Profile(已有規則)  
--  
於現有config.RULENAME.exists.profiles中，新增一組profile  
  
EXAMPLE:\<meta name=“robots” /\> existing or not  
於config.rule.exists.profiles加入一組物件  
{'selector': 'meta[name="robots"]',  
'enable': true,  
'message' 'There are %i <meta> tag with name = "robots" attribute'}  
  
如何新增rule(尚未有規則)  
--
1.於config.js中的Array變數config.rules，加入rule name  
2.新增該rule的profiles:  
config.rule.RULENAME.profiles=[{}...];  
3.於scanner.js中的function scanner.ruleValidate()實作該rule
