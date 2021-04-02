const userService = require("../services/userService");
const authBundle = require("../auth/authBundle");
const config = require('../config/config');
const tokenGenerator = require("../auth/tokenGenerator");

/**
 * Sends via response the new rendered registration page
 * @param req
 * @param res
 */
exports.getRegistration = function (req, res) {
    res.render('registration', {title: 'Registration'});
}
/**
 * This function handles the registration process of a new user.
 * The user gets stored into the database with hashed password.
 * He also gets a session token for his first session in the application.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.register = async function (req, res) {
    const body = req.body;
    if (!(body.username && body.password)) {
        return res.status(400).send({error: "Incoming data invalid"});
    }
    const encryptionParam = authBundle.getEncryptionParam();
    const salt = await authBundle.getBcrypt().genSalt(encryptionParam);
    body.password = await authBundle.getBcrypt().hash(body.password, salt);
    await userService.add(body, async function (err, user) {
        if (user) {
            await tokenGenerator(res, user.id);
            /*res.status(200).send({auth: true});*/
            res.redirect('/login');
        } else {
            return res.status(500).send({error: "Error occurred while registration process: " + err});
        }
    });
}
