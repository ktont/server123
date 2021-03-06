
const path = require("path");
const url = require("url");
const querystring = require("querystring");


function _send200(data) {
  if(this.finished) return;

  this.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  if(data == null) return this.end();

  if(typeof data == 'object') {
    data = JSON.stringify(data);
  }
  this.end(data);
}

function _send500(data) {
  if(this.finished) return;
  
  this.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
  if(data == null) return this.end();

  if(typeof data == 'object') {
    data = data instanceof Error ? 
           data.stack : 
           JSON.stringify(data);
    data += '\n';
  }
  this.end(data);
}

function initContext(req, res) {
  const p = url.parse(req.url, true);
  req.pathname_ = path.normalize(p.pathname.replace(/\/$/, ''));
  req.query_ = p.query;
  req.body_ = {};

  res.send200 = _send200.bind(res);
  res.send500 = _send500.bind(res);

  return new Promise((resolve, reject) => {
    var bufs = [];
    req.on('data', bufs.push.bind(bufs)).on('end', ()=>{
      if(bufs.length) {
        var type = req.headers['content-type'] || '';
        var body = Buffer.concat(bufs).toString();
        if(body === '') {
          res.end();
          return reject('end');
        }
        req.body_ = body;
        if(type.startsWith('application/json')) {
          try {
            req.body_ = JSON.parse(body);
          } catch(err) {
            return reject(new Error('invalidJSON'));
          }
        } else if(type.startsWith('application/x-www-form-urlencoded')) {
          try {
            req.body_ = querystring.parse(body);
          } catch(err) {
          }
        }
      }
      resolve();
    });
  })
}

module.exports = initContext;
