
function sleep(n) {
	return new Promise((resolve) => setTimeout(resolve, n*1000));
}

module.exports = async (arg) => {
  var arg = arg || [4,5,6];
  for (var i = 0; i<arg.length; i++) {
    console.log('begin sleep', arg[i], new Date());
    await sleep(arg[i]);
    console.log('end', new Date());
  }
  return 'done';
}
