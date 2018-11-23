// 坑：这里不能自动重连, 纯粹意义的单链接。pool模式可以重新连接，全自动的。
var mysql = require('mysql');
var config = require('../../config.js');

var connection = mysql.createConnection(config.mysql);
connection.connect();

module.exports = connection; 
