const moment = require('moment');
const {addUser, removeUser, getUserById, getByUsername, getAllUsers, resetList} = require("../services/chatService");
const userService = require('../services/userService')
const bot = 'Shaed-Bot';
let instance = process.env.CF_INSTANCE_INDEX || 'localhost';

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
        socket.on('tellUsername', async username => {
            // On connect for new user
            socket.emit('information', {header: formatHeader(bot), payload: {message: username + ', welcome to Shaed!', fileType: 'text'}});
            socket.emit('init', username);
            await userService.getByUsername(username, async function(err, user) {
                if(user.img) {
                    socket.emit('profilePicture', formatBackgroundImage(user.img));
                }
            });
            //resetList();
            io.emit('syncUsers');
            // Problem here not every user synced in servers list!
            socket.broadcast.emit('information', {header: formatHeader(bot), payload: {message: username + ' conntected to Shaed!', fileType: 'text'}});
        });

        socket.on('clientSync', username => {
            addUser(socket.id, username);
            let user = getUserById(socket.id);
            io.emit('updateUserList', user);
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
        // GROUP INVITE
        socket.on('group invite', groupName => {
            socket.join(groupName);
        });

        // DISCONNECT
        socket.on('disconnect', async () => {
            io.emit('information', {header: formatHeader(bot), payload: {message: getUserById(socket.id).username + ' disconnected from Shaed!', fileType: 'text'}});
            let user = getUserById(socket.id);
            await removeUser(socket.id);
            // TODO change so it only removes 1 user from client
            io.emit('removeUser', user);
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
        instance,
        username,
        time: moment().format('HH:mm:ss')
    }
}

function formatBackgroundImage(image) {
    return 'url(' + image + ')';
}

module.exports = {
    getChat,
    initSocketIo
};
