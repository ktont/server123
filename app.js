const http = require('http');
const logger = require('./lib/logger.js');
const config = require('./config.js');
const mkdir = require('./lib/mkdir.js');
const dispatch = require('./http/dispatch.js');

const router1 = require('./router1.js');
const router2 = require('./router2.js');

process.on('uncaughtException', (err) => {
  logger.error('未捕获', err.stack);
});

//mkdir log_root if not exists
mkdir(config.log_root);

http.createServer(dispatch([router1, router2]))
.listen(config.port, () => {
  logger.info('pid[' + process.pid + '], listening ' + config.port);
});
