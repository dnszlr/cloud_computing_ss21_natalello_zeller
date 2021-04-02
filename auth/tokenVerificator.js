const jwt = require('jsonwebtoken');
const config = require('../config/config');


/**
 * This function is used to verify the token of a specific http request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.verify = function (req, res, next) {
    let token = req.cookies.token;
    if (!token) {
        return res.status(403).send({auth: false, message: 'Missing token.'});
    }
    jwt.verify(token, config.jwt.secret, function (err, decoded) {
        if (err) {
            return res.status(500).send({auth: false, message: 'Token could not get verified'});
        }
        req.userId = decoded.id;
        next();
    });
}