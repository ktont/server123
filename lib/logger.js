const bunyan = require('bunyan');
const config = require('../config.js');

let logger;

if(process.argv[2] == '-d') {
  logger = bunyan.createLogger({
    name: 'all',
    stream: process.stdout
  });
} else {
 logger = bunyan.createLogger({
    name: 'all',
    streams: [{
        type: 'rotating-file',
        path: config.log_root + '/all.log',
        period: '1d',
        count: 50
    }]
  });
}

logger._emit = (rec, noemit) => {
  delete rec.v;
  delete rec.hostname;
  delete rec.name;
  delete rec.pid;
  bunyan.prototype._emit.call(logger, rec, noemit);
};

module.exports = logger;

