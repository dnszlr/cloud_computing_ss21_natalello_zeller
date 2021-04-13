const userService = require("../services/userService");
const encryptionHelper = require("../auth/encryptionHelper");
const tokenGenerator = require("../auth/tokenGenerator");

/**
 * Sends via response the new rendered registration page
 * @param req
 * @param res
 */
getRegistration = function (req, res) {
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
register = async function (req, res) {
    const body = req.body;
    if (!(body.username && body.password)) {
        return res.send({status: 400, error: "Incoming data invalid"});
    }
    body.password = await encryptionHelper.encrypt(body.password);
    await userService.add(body, async function (err, user) {
        if (user) {
            await tokenGenerator(res, user.id);
            res.send({status: 200, auth: true, location: '/login'});
        } else {
            return res.send({status: 500, error: err});
        }
    });
}

module.exports = {
    getRegistration,
    register
}
