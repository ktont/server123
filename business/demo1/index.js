const sleep = require('../../lib/sleep.js');

module.exports = async (arg) => {
  var arg = arg || [4,5,6,100];
  for (var i = 0; i<arg.length; i++) {
    console.log('begin sleep', arg[i], new Date());
    await sleep(arg[i]);
    console.log('end', new Date());
  }
  return 'done';
}
