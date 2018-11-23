const fs = require('fs');
const path = require('path');
/**
 * 检查目录是否存在(sync方式)，如果不存在，则尝试创建
 * @returns
 *      null 成功
 *      err  失败
 */
/*
module.exports = function(paths) {
    paths.forEach(function(str) {
        createDirectorySync(str);
    });
    return;
}
*/
function createDirectorySync(str) {
    //创建目录
    function mkdir(p) {
        (function make(p) {
            try {
                fs.mkdirSync(p);
            } catch(e) {
                if(e) {
                    if(e.code === 'ENOENT') {
                        make(path.dirname(p));
                        make(p);
                    }
                } else return;
            }
        })(p);
    }

    try {
        var exists = fs.existsSync(str);
        if(exists) {
            return null;
        } else {
            mkdir(str);
            return null;
        }
    } catch(err) {
        console.error(err.message);
        //How do
        process.exit(1);
        return err;
    }
}

module.exports = createDirectorySync;
