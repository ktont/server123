//const mysqlCli = require("../../lib/mysql/single.js");
const pool = require("../../lib/mysql/pool.js");

function sleep(n) {
	return new Promise((resolve) => setTimeout(resolve, n*1000));
}

function query2() {
	return new Promise((resolve, reject) => {
    pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) {
        console.log('99999999999999999');
        return reject(error);
      }
      console.log('The solution is: ', results[0].solution);
      resolve('query2:' + results[0].solution+'\n');
    });
  });
}

function query3() {
  return new Promise((resolve, reject) => {
    pool.query('select * from test.tab1', function (error, results, fields) {
      if (error) {
        console.log('88888888888888');
        return reject(error);
      }
      console.log('The solution is: ', results);
      resolve(results);
    });
  });
}

module.exports = async (arg) => {
  console.log(new Date(), '11111111111');
  await sleep(2);
  return await query3();
}
