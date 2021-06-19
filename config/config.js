// config.js

const config = {
    app: {
        port: 8080,
    },
    db: {
        dbUsername: 'shaed',
        mongoPath: 'shaeddb.v7gys.mongodb.net/ccShaed'
    },
    jwt: {
        secret: 'esistzuwild',
        tokenDuration: 3600
    },
    cookie: {
        lifetime: 1800000
    },
    redis: {
        host: "redis-10002.c2.eu-west-1-3.ec2.cloud.redislabs.com",
        rPort: 10002,
        name: 'default',
        password: "0EPzzFetOEBL3sfUyoYjiZb9QT1fesNG"
    }
};

module.exports = config;