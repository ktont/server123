var crypto = require('crypto');

module.exports = function(text) {
    return crypto.createHash('sha1').update(text).digest('hex');
}