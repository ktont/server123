var redis = require('redis');
var config = require('../../config.js');
var logger = require('../../lib/logger.js');

module.exports = (table) => {
  var client;
  var begin = true;
  table = table || 0; //默认选择 0 号数据库

  client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

  client.on("ready", () => {
    if(begin) {
      begin = false;
      //logger.info('redis,连接成功');
    } else {
      //logger.info('redis,重新连接成功');
    }
    client.select(table);
  });
  client.on("error", (err) => {
    /*
     * redis的error事件有下列几种：
     *   网络原因，连接不上
     *   认证失败
     *   reply消息解析异常
     *   没有回调函数
     * 如果是网络原因，连接不上，则退出程序
     */
    if(begin) {
      begin = false;
      logger.error('连接redis失败', err.toString());
      //process.exit(1);
    } else {
      logger.error('redis error', err.toString());
    }
  });
  return client;
}
