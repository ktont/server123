module.exports = {
    port: 3000,
    log_disable: false,
    log_root: '/tmp/logs',
    redis: {
        port: '6379',
        host: 'localhost',
        options: {auth_pass:'1234'}
    },
    mysql: {
        host     : 'localhost',
        user     : 'test',
        password : '1234',
        database : 'test',
        charset: 'utf8mb4',
    }
};
