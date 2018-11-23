const RedisExec = require("../../lib/redis/RedisExec.js");
const config = require('../../config.js');

var conn = new RedisExec(1);

var pack = conn.client.sha1pack(`
    local r = redis.call('keys', '*')
    local count = 0
    for k,v in ipairs(r) do
        /*
         * k: index of Array
         * v: the redis key
         */
        count = count + 1
    end
    return 'the dbsize: '..count
`);

module.exports = () => {
  return conn.client.evalScript(pack);
}
