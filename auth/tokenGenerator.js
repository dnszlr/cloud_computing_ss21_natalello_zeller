const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 *
 * @param res: http response
 * @param id: user id user for generating token
 * @returns new http reponse with cookie and token inside.
 */
const tokenGenerator = (res, id) => {
    const token = jwt.sign({id: id}, config.jwt.secret, {
        expiresIn: config.jwt.tokenDuration
    });
    console.log("Im tokenGenerate: " + token);
    return res.cookie(id, token, {
        expires: new Date(Date.now() + config.cookie.lifetime),
        secure: false,
        httpOnly: true
    });
};
module.exports = tokenGenerator;