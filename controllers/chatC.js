const moment = require('moment');
const {addUser, getCurrentUser, getAllUsers} = require("../services/chatService");
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
            addUser(socket.id, username);
            let users = getAllUsers();
            // On connect for new user
            socket.emit('information', formatMessage(bot, 'Welcome to Shaed: ' + getCurrentUser(socket.id).username));
            socket.emit('updateUserList', users);
            // On connect for other users
            socket.broadcast.emit('information', formatMessage(bot, getCurrentUser(socket.id).username + ' conntected to Shaed!', users));
            socket.broadcast.emit('updateUserList', users);

            // CHAT MESSAGE
            socket.on('chat message', (msg) => {
                io.emit('chat message', formatMessage(getCurrentUser(socket.id).username, msg));
            });

            // DISCONNECT
            socket.on('disconnect', () => {
                io.emit('information', formatMessage(bot, getCurrentUser(socket.id).username + ' disconnected from Shaed!'));
                io.emit('updateUserList', users);
            });
        });
    });
}

/**
 * Formats the parameters to a compromised message.
 * @param username
 * @param message
 * @returns The compromised message
 */
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
