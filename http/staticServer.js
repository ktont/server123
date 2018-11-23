const url = require("url");
const path = require("path");
const fs = require("fs");

const mimeTypes = {
  "htm": "text/html",
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "js": "text/javascript",
  "map": "text/javascript",
  "css": "text/css",
};

const rootWWW = __dirname + '/../fe';

module.exports = function(req, res) {
  var uri = req.pathname_
  , filename = path.join(rootWWW, uri)
  , root = uri.split("/")[1];

  if(uri === '/favicon.ico') return res.end();

  fs.exists(filename, function(exists) {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      console.error(`404: ${filename} ${JSON.stringify(req.query_)}`);
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        console.error(`500: ${filename} ${JSON.stringify(req.query_)}`);
        return;
      }

      var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
      res.writeHead(200, {"Content-Type": mimeType});
      res.write(file, "binary");
      res.end();
      console.error(`200: ${filename} ${mimeType} ${JSON.stringify(req.query_)}`);
    });
  });
}
