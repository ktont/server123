var mysql = require('mysql');
var config = require('../../config.js');

//自动重连，全自动模式
var pool = mysql.createPool(Object.assign(config.mysql, {
    connectionLimit : 10,
}));

module.exports = pool;
