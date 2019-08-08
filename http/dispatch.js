const logger = require('../lib/logger.js');
const config = require('../config.js');

const initContext = require('./initContext.js');

async function handleRequest(req, res, router) {
  await initContext(req, res);
  return await router(req, res);
}

//TODO: 下一版本，我想让 接管 res.end ，把它 bind 死。然后检测它有没有调用。
// 如果调用过了 res.end，那么后续的 catch 就不用判断 end break 了

module.exports = (router) => {
  return (req, res, router) => {
    logger.access(req.url);
    handleRequest(req, res, router)
    .then(ret => {
      res.send200(ret);
    })
    .catch(err => {
      if(err === 'end' || 
         err === 'break') return;
      res.send500(err);
      if(err instanceof Error) {
        logger.error(err.stack);
      }
    });
  }
}

