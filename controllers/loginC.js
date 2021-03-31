const userService = require("../services/userService");
const bcrypt = require("bcrypt");

exports.getLogin = function (req, res) {
    res.render('login', {title: 'Login'});
}

exports.verification = async function (req, res) {
    const body = req.body;
    await userService.getByUsername(body.username, async function (err, user) {
        console.log(user);
        if (user) {
            const isPWValid = await bcrypt.compare(body.password, user.password);
            if (isPWValid) {
                res.status(200).json({message: "Valid password"});
            }
        } else {
            res.status(400).json({error: "Invalid username or password"});
        }
    });
}
