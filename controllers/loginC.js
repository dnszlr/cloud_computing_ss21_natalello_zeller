
exports.getLogin = function(req, res, next) {
    res.render('login', { title: 'Login' });
}