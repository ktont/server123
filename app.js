const http = require('http');
const logger = require('./lib/logger.js');
const config = require('./config.js');
const dispatch = require('./http/dispatch.js');
const mkdir = require('./lib/mkdir.js');

process.on('uncaughtException', (err) => {
  logger.error('未捕获', err.stack);
});

//检查日志目录是否存在
mkdir(config.log_root);

const server = http.createServer();
dispatch(server);
server.listen(config.port, () => {
  logger.info('pid[' + process.pid + '], listening ' + config.port);
});
