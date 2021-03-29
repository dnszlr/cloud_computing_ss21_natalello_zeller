
exports.getRegistration = function(req, res, next) {
    res.render('registration', { title: 'Registration' });
}

exports.submitCredentails = function(req, res, next) {
    console.log(email)
}