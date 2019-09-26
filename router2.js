
module.exports = function(req, res) {
  switch(req.pathname_) {
    case '/test2':
      res.end('Pong2');
      return;
  }
}

