const moment = require('moment');
const {addUser, removeUser, getCurrentUser, getAllUsers} = require("../services/chatService");
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
        socket.on('tellUsername', data => {
            addUser(socket.id, data.username);
            console.log(data.window);
            let users = getAllUsers();
            // On connect for new user
            socket.emit('information', {message: formatMessage(bot, 'Welcome to Shaed ' + getCurrentUser(socket.id).username), window: data.window});
            socket.emit('init', data.username);
            // Sends logged in user list to everyone in chatroom
            io.emit('updateUserList', users);
            // On connect for other users
            socket.broadcast.emit('information', {message: formatMessage(bot, getCurrentUser(socket.id).username + ' conntected to Shaed!'), window: data.window});
        });
        // CHAT MESSAGE
        socket.on('chat message', data => {
            io.emit('chat message', {message: formatMessage(getCurrentUser(socket.id).username, data.message), window: data.window});
        });
        // DISCONNECT
        socket.on('disconnect', async () => {
            io.emit('information', formatMessage(bot, getCurrentUser(socket.id).username + ' disconnected from Shaed!'));
            await removeUser(getCurrentUser(socket.id).id);
            io.emit('updateUserList', getAllUsers());
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
