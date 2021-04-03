const userService = require("../services/userService");
const authBundle = require("../auth/authBundle");
const tokenGenerator = require('../auth/tokenGenerator')
/**
 * Sends via response the new rendered login page
 * @param req
 * @param res
 */
exports.getLogin = function (req, res) {
    res.render('login', {title: 'Login'});
}

/**
 * This function handles the verification of user credentials passed from the user.
 * If the credentials are valid the user gets logged into the system and gets a new session token.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.verification = async function (req, res) {
    const body = req.body;
    await userService.getByUsername(body.username, async function (err, user) {
        if (err) {
            return res.status(500).send('Server Error');
        }
        if (user) {
            const isPWValid = await authBundle.getBcrypt().compare(body.password, user.password);
            if (isPWValid) {
                await tokenGenerator(res, user.id);
                /*res.status(200).send({auth: true});*/
                res.redirect('/chat');
            } else {
                // TODO Add label for feedback to pug file
                return res.status(401).send({auth: false, token: null});
            }
        } else {
            res.status(404).send('User not found');
        }
    });
}

/**
 * This function handles the logout process, single sets the auth to false and takes away the token.
 * @param req
 * @param res
 */
exports.logout = function (req, res) {
    /*res.status(200).send({auth: false});*/
    res.redirect('/login');
}