var redisEmbededLua = require('redis-embeded-lua');
var createClient = require('./createClient.js');
var logger = require('../../lib/logger.js');
var prettyDateString = require('../../lib/prettyDate.js').prettyDateString;
var sha1sum = require('../../lib/sha1sum.js');

function RedisExec(table) {
  this.table = table || 0;
  this.client = createClient(this.table);
  redisEmbededLua.attach(this.client);
}

/**
 * 这是一个demo，不要动
 * 获取持久化的用户信息
 * @param username
 * @returns {Promise}
 */
RedisExec.prototype.demoForGet = function(username) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.client.hgetall(username, function(err, reply){
            if(err) {
                logger.error(self.table, 'get', err.message);
                reject(err);
            } else {
                resolve(reply || {});
            }
        });
    });
};

/**
 * 这是一个demo，不要动
 * 持久化cookie
 * @param username
 * @param pack
 *      cookie
 *      hotelID
 *      hotelName
 *      isSingleHotel 帐号下是否只有一家酒店
 *      passwd
 * @returns {Promise}
 */
RedisExec.prototype.demoForSet = (function() {
  const script = `
    local userinfo = cjson.decode(ARGV[1])
    local keyExistsFlag = redis.call('exists', KEYS[1])
    for k,v in pairs(userinfo) do
      redis.call('hset', KEYS[1], k, v)
    end
    redis.call('hset', KEYS[1], 'updateTime', ARGV[2])
    if keyExistsFlag == 0 then
      redis.call('hset', KEYS[1], 'createTime', ARGV[2])
    end
    return
  `;
  const sha1 = sha1sum(script);
  return function(username, pack) {
    return this.evalScript(cmds,sha1,
      1,
      username,
      JSON.stringify(pack),prettyDateString(new Date())
    );
  };
})();

/**
 * 设定key的ttl，ttl为毫秒
 * @returns {Promise}
 */
RedisExec.prototype.ttl = function(key, ttl) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.client.PEXPIRE(key, ttl, function(err, reply) {
            if(err) {
                logger.error(self.table, 'ttl', err);
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}

/**
 *
 * @param key
 * @returns {Promise}
 */
RedisExec.prototype.del = function(key) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.client.del(key, function(err, reply){
            if(err){
                logger.node(self.table, 'del', err.message);
                reject(err);
            }else{
                resolve(reply);
            }
        })
    })
};

/**
 *
 * @param key
 * @returns {Promise}
 */
RedisExec.prototype.delCookie = function(key) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.client.hdel(key, 'cookie', 'auditCookie', function(err, reply){
            if(err) {
                logger.node(self.table, 'del', err.message);
                reject(err);
            } else {
                resolve(reply);
            }
        })
    })
};


RedisExec.prototype.getAllLoginInfo = function() {
    var self = this;
    return new Promise(function(resolve, reject){
        self.client.keys('*', function(err, usernames) {
            if(err) {
                logger.node(self.table, 'getAllLoginInfo', err.message);
                return reject(err);
            }
            var promises = [];
            usernames.forEach(function(username){
                promises.push(self.get(username));
            });

            return Promise.all(promises).then(function(infos){
                var ret = {};
                usernames.forEach(function(username, i){
                    ret[username] = infos[i];
                });
                resolve(ret);
            }).catch(function(e){
                logger.node(self.table, 'getAllLoginInfo', e.stack);
                reject(e);
            });
        })
    })
};

RedisExec.prototype.keys = function() {
    var self = this;
    return new Promise(function(resolve, reject){
        self.client.keys('*', function(err, usernames){
            if(err){
                logger.error(self.table, 'keys', err.message);
                reject(err);
            }else{
                logger.node(self.table, 'keys', usernames.length);
                resolve(usernames);
            }
        })
    })
};

//记录当前密码错误, keepAlive时就不登录了
RedisExec.prototype.setErrorPasswd = function(uname) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.client.hdel(uname, 'passwd', function(err){
            if(err) {
                logger.error(self.table, 'setErrorPasswd', err);
                reject(err);
            }else{
                logger.node(self.table, 'setErrorPasswd', uname);
                resolve();
            }
        })
    })
};

//记录活跃用户集合
RedisExec.prototype.active = function() {
}

/*
 * 用来返回昨日登录过的所有用户帐号信息
 * 参数： 无
 * 返回：{promise}
 *      -> resolve: [ {channel: elong, username: xx, password: yy}, ... ]
 *      -> reject: Error
 */
RedisExec.prototype.getLastDayActiveUsers = function() {

}

//返回数据库中，有cookie的key数。
RedisExec.prototype.cookieCount = (function() {
    const script = `
    local count = 0
    local r = redis.call("keys", "*")
    for k,v in pairs(r) do
      if redis.call("hget", v, "cookie") then
        count = count + 1
      end
    end
    return count
    `;
    return function () {
        return this.evalScript(script);
    };
})();

RedisExec.prototype.dbsize = function() {
    var self = this;
    return new Promise(function(resolve, reject){
       self.client.dbsize(function(err, r){
            if(err){
                reject(err);
            }else{
                resolve(r);
            }
        })
    })
};

RedisExec.prototype.evalScript = function() {
    var self = this;
    var args = [].slice.call(arguments, 0);
    var script;
    if(typeof(args[1]) == 'number' || args.length == 1) {
        script = args[0];
        args[0] = sha1sum(script);
    } else if(typeof(args[2]) == 'number' || args.length == 2) {
        script = args.shift();
    } else {
        return Promise.reject(new Error('parameter invalid.'));
    }

    args.push(null);
    return new Promise(function(resolve, reject) {
        (function againAgain(retry) {
            args[args.length-1] = function(err, ret) {
                if(err && err.message.startsWith('NOSCRIPT') && !retry) {
                    return self.client.script('load', script, function(err, sha1) {
                        if(err) {
                            return reject(err);
                        }
                        againAgain(true);
                    });
                } else if(err) {
                    reject(err);
                } else {
                    resolve(ret);
                }
            }
            self.client.evalsha.apply(self.client, args);
        })(false);
    });
}

// var dbMap = {
//     ctrip: new RedisExec(1),
//     elong: new RedisExec(2)
// }

// module.exports = new RedisExec();
module.exports = RedisExec;
