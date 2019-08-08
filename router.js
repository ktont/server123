const url = require("url");
const path = require("path");
const fs = require("fs");

const sleep = require('./lib/sleep.js');

const hostname = require('os').hostname();
const MOCK = hostname == 'user1.desttop' || 
             hostname == 'user2.localhost' ||
             false ? '_mock' : '';

//const xx = MOCK ? require('./xxMock.js') : require('./xx.js');
const demo1 = require('./business/demo1');
//const demo2 = require('./business/demo2');
const demo3 = require('./business/demo3');

module.exports = function(req, res) {
  switch(req.pathname_) {
    case '/error':
      res.send500(new Error('fake'));
      return;
    case '/ok':
      console.log('22222222222', req.body_);
      return sleep(1000)
      .then(() => new Promise((A, B) => {
        A('ok');
      }));
    case '/demo1':
      return demo1();
    //case '/demo2':
    //  return demo2();
    case '/demo3':
      return demo3();
    default:
      throw new Error('NotFound '+req.pathname_);
  }
}

