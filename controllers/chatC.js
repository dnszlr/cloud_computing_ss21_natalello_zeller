
exports.getChat = function(req, res, next) {
    res.render('chat', { title: 'Chatroom' });
}