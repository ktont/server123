/**
 * 日志模块
 * 对tracer的功能进行了限制，只输出特定格式的日志。
 */
const tracer = require('tracer');
const config = require('../config.js');

function createFunc(fname) {
  var filter;

  if(process.argv[2] == '-d') config.env = 'dev';

  if(config.env == 'prod' && fname == 'debug') 
    return (function(){});

  if(config.env == 'prod') {
    var filter = function(s,d){
      d.title = fname;
      return s;
    }
  } else {
    var filter = function(s,d){
      d.title = fname;
      console.log(d.title+': '+s);
      return s;
    }
  }

  return tracer.dailyfile({
      "root": config.log_root,
      "format": "{{timestamp}} {{message}}",
      "dateformat": 'HH:MM:ss',
      "splitFormat": 'yyyymmdd',
      "filters": filter
  }).log;
}

[
'info',
'error',
'log'
]
.forEach(function(name) {
    module.exports[name] = createFunc(name);
});
