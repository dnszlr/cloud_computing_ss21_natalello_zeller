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
        host: 'redis-18403.c1.eu-west-1-3.ec2.cloud.redislabs.com',
        port: 18403,
        name: 'shaedAdmin',
        password: '!rEdIsUsErSoSe21!'
    }
};

module.exports = config;