var mysql = require('mysql');
var config = require('../../config.js');

var poolCluster = mysql.createPoolCluster();
poolCluster.add(config.mysql);

module.exports = poolCluster; 

