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
            socket.emit('information', {header: formatHeader(bot, getUserById(socket.id).username), payload: {message: username + ', welcome to Shaed!', fileType: 'text'}});
            socket.emit('init', username);
            // Sends logged in user list to everyone in chatroom
            io.emit('updateUserList', users);
            // On connect for other users
            socket.broadcast.emit('information', {header: formatHeader(bot, getUserById(socket.id).username), payload: {message: username + ' conntected to Shaed!', fileType: 'text'}});
        });
        // CHAT MESSAGE
        socket.on('chat message', data => {
            io.emit('chat message', {header: formatHeader(getUserById(socket.id).username), payload: data});
        });
        // PRIVAT MESSAGE
        socket.on('private message', data => {
            io.to(data.to.id).emit('private message', {header: formatHeader(getUserById(socket.id).username), payload: data});
            let toSafe = data.to;
            data.to = data.from;
            data.from = toSafe;
            socket.emit('private message', {header: formatHeader(getUserById(socket.id).username), payload: data});
        });
        // GROUP MESSAGE
        socket.on('group message', data => {
            console.log(data);
            io.to(data.groupName).emit('group message', {header: formatHeader(getUserById(socket.id).username), payload: data});
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
            io.emit('information', {header: formatHeader(bot, getUserById(socket.id).username), payload: {message: ' disconnected from Shaed!', fileType: 'text'}});
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
function formatHeader(username) {
    return {
        username,
        time: moment().format('HH:mm:ss')
    }
}

module.exports = {
    getChat,
    initSocketIo
};
