const logger = require('../lib/logger.js');
const config = require('../config.js');

const initContext = require('./initContext.js');

async function handleRequest(req, res, router) {
  await initContext(req, res);
  return await router(req, res);
}

module.exports = (router) => {
  return (req, res) => {
    logger.access(req.url);
    handleRequest(req, res, router)
    .then(ret => {
      res.send200(ret);
    })
    .catch(err => {
      res.send500(err);
      if(err instanceof Error) {
        logger.error(err.stack);
      }
    });
  }
}

