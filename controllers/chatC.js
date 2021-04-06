const moment = require('moment');
const {addUser, getCurrentUser} = require("../services/chatService");
const bot = 'Shaed-Bot';

/**
 * Gets the chat.pug and renders it for client side
 * @param req
 * @param res
 * @param next
 */
getChat = function (req, res, next) {

    res.render('chat', {title: 'Chatroom'});
}

/**
 * Handles the complete socket.io process for the passed io.
 * @param io
 */
function initSocketIo(io) {
    io.on('connection', (socket) => {
        socket.on('tellUsername', username => {
            const user = addUser(socket.id, username);

            // On connect for new user
            socket.emit('message', formatMessage(bot, 'Welcome to Shaed: ' + getCurrentUser(socket.id).username));

            // On connect for other users
            socket.broadcast.emit('message', formatMessage(bot, getCurrentUser(socket.id).username + ' conntected to Shaed!'));

            // CHAT MESSAGE
            socket.on('chat message', (msg) => {
                io.emit('chat message', formatMessage(getCurrentUser(socket.id).username, msg));
            });

            // DISCONNECT
            socket.on('disconnect', () => {
                io.emit('message', formatMessage(bot, getCurrentUser(socket.id).username + ' disconnected from Shaed!'));
            });
        });
    });
}

function formatMessage(username, message) {
    return {
        username,
        message,
        time: moment().format('hh:mm:ss')
    }
}

module.exports = {
    getChat,
    initSocketIo
};
