const moment = require('moment');
const {addUser, removeUser, getUserById, getByUsername, getAllUsers} = require("../services/chatService");
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
            socket.emit('information', formatMessage(bot, 'Welcome to Shaed ' + getUserById(socket.id).username));
            socket.emit('init', username);
            // Sends logged in user list to everyone in chatroom
            io.emit('updateUserList', users);
            // On connect for other users
            socket.broadcast.emit('information', formatMessage(bot, getUserById(socket.id).username + ' conntected to Shaed!'));
        });
        // CHAT MESSAGE
        socket.on('chat message', message => {
            io.emit('chat message', formatMessage(getUserById(socket.id).username, message));
        });
        // PRIVAT MESSAGE
        socket.on('private message', data => {
            socket.emit('private message', {message: formatMessage(getUserById(socket.id).username, data.message), from: data.to, to: data.from});
            io.to(data.to.id).emit('private message', {message: formatMessage(getUserById(socket.id).username, data.message), from: data.from, to: data.to});
        })
        // GROUP MESSAGE
        socket.on('group message', data => {
            console.log(data.groupName);
            io.to(data.groupName).emit('group message', {message: formatMessage(getUserById(socket.id).username, data.message), groupName: data.groupName});
        });

        // JOIN GROUP
        socket.on('createGroup', data => {
            for (let i = 0; i < data.groupUser.length; i++) {
                io.to(data.groupUser[i].id).emit('group invite', data.groupName);
            }
        });

        socket.on('group invite', groupName => {
            socket.join(groupName);
        });

        // DISCONNECT
        socket.on('disconnect', async () => {
            io.emit('information', formatMessage(bot, getUserById(socket.id).username + ' disconnected from Shaed!'));
            await removeUser(socket.id);
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
        time: moment().format('HH:mm:ss')
    }
}

module.exports = {
    getChat,
    initSocketIo
};
