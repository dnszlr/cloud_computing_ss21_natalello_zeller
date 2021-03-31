let userService = require("../services/userService");
const bcrypt = require("bcrypt");
const salt = 15;

exports.getRegistration = function (req, res) {
    res.render('registration', {title: 'Registration'});
}

exports.register = async function (req, res) {
    const body = req.body;
    if (!(body.username && body.password)) {
        return res.status(400).send({error: "Incoming data invalid"});
    }
    body.password = await bcrypt.hash(body.password, await bcrypt.genSalt(salt));
    userService.add(body).then((result) => {
        res.redirect('/login');
    }).catch((err) => {
        res.status(400).json({error: "Error at register process: " + err});
    });
}
