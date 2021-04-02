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
    }
};

module.exports = config;