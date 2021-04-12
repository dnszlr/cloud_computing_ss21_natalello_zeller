const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userService = require('../services/userService');


/**
 * This function is used to verify the token of a specific http request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.verify = function (req, res, next) {
    console.log(req.query.username);
    userService.getByUsername(req.query.username, async function (err, user) {
        let token = user ? req.cookies[user.id] : undefined;
        console.log("Im token: " + token);
        if (!token) {
            res.redirect('login');
        }
        jwt.verify(token, config.jwt.secret, function (err, decoded) {
            if (err) {
                res.redirect('login');
            }
            req.userId = decoded.id;
            next();
        });
    });
}