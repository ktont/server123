const logger = require('../lib/logger.js');
const config = require('../config.js');

const initContext = require('./initContext.js');
const staticServer = require('./staticServer.js');

async function handleRequest(req, res, router) {
  await initContext(req, res);
  if(Array.isArray(router)) {
    for(let i=0;i<router.length;i++) {
      await router[i](req, res);
    }
  } else {
    await router(req, res);
  }
  
  if(!res.finished) {
    staticServer(req, res);
  }
}

module.exports = (router) => {
  return (req, res) => {
    logger.access(req.url);
    handleRequest(req, res, router)
    .catch(err => {
      res.send500(err);
      if(err instanceof Error) {
        logger.error(err.stack);
      }
    });
  }
}

