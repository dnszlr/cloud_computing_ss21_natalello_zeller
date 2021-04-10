const socket = io();
// Elements on the left of the view
let ulUser = document.getElementById('ulUser');
let aUsername = document.getElementById('aUsername');
// Room navigation
let ulRoomNav = document.getElementById('ulRoomNav');
// Input at the bottom
let formChat = document.getElementById('formChat');
let inputChat = document.getElementById('inputChat');
// Chatroom in the middle
let chatRoom = document.getElementById('chatRoom');
// Main Chat Window name
const mainName = 'Shaed';
// Main Chat Window
let mainWindow = '';
// Current watched window
let activeWindow = '';
// Safes all windows
let windowStorage = [];
// Username of logged in user;
let username = getFromUri('username');
// All logged in users
let users = [];


initView(mainName);

/**
 * Initialization function for the chat view.
 */
function initView(initChatName) {
    addRoom(initChatName);
    mainWindow = appendWindowToChatRoom(initChatName);
    setActiveWindow(mainWindow);
    bringUpChatWindow(mainWindow);
    // Emits username to server, initial 'say hello' from client to server.
    let username = getFromUri('username');
    socket.emit('tellUsername', username);
}

function setActiveWindow(chatWindow) {
    return activeWindow = chatWindow;
}

/**
 * Adds clickListener to user list to append a new chat window on click
 */
ulRoomNav.addEventListener('click', function (navbarElement) {
    let roomName = navbarElement.target.textContent;
    let chatWindow = appendWindowToChatRoom(roomName);
    setActiveWindow(chatWindow);
    bringUpChatWindow(chatWindow);
});

/**
 * Adds clickListener to user list to append a new chat window on click
 */
ulUser.addEventListener('click', function (userListElement) {
    let username = userListElement.target.textContent;
    if (ulUserContains(username) && username != getFromUri('username')) {
        addRoom(username);
    }
});

/**
 * Adds Eventlistener for form to emit messages to server.
 */
formChat.addEventListener('submit', function (event) {
    event.preventDefault();
    if (inputChat.value) {
        // Emit message to server
        console.log("Active Window id: " + activeWindow.id);
        if(activeWindow === mainWindow) {
            console.log("public message");
            socket.emit('chat message', inputChat.value);
        } else if(ulUserContains(activeWindow.id)) {
            console.log("private message");
            socket.emit('private message', {message: inputChat.value, from: getUserFromUsername(username), to: getUserFromUsername(activeWindow.id)})
        } else {
            console.log(activeWindow.id);
            socket.emit('group message', {message: inputChat.value, groupName: activeWindow.id})
        }
        // Reset input value
        inputChat.value = '';
        inputChat.focus();
    }
});

function bringUpChatWindow(chatWindow) {
    windowStorage.forEach(window => {
        window === chatWindow ? window.className = 'messages' : window.className = 'messagesHidden';
    });
}

function appendWindowToChatRoom(chatName) {
    console.log("chatName in append: " + chatName);
    let chatWindow = getChatWindow(chatName);
    if (!chatWindow) {
        chatWindow = createChatWindow(chatName);
    }
    chatRoom.appendChild(chatWindow);
    return chatWindow;
}

/**
 * Returns a chat window by a passed name
 * @param chatName
 * @returns a chat window
 */
function getChatWindow(chatName) {
    return windowStorage.find(storageWindow => storageWindow.id === chatName);
}

/**
 * Creates a new chat window
 * @param chatName: name of the new !!!chat must have the same name as the private chat user!!!
 */
function createChatWindow(chatName) {
    let chatWindow = document.createElement('ul');
    chatWindow.className = 'messagesHidden';
    chatWindow.id = chatName;
    windowStorage.push(chatWindow);
    return chatWindow;
}

/**
 * Adds a new room to navbar !!!navbar entry must have the same name as the private chat user!!!
 * @param roomName
 */
function addRoom(roomName) {
    if (!ulRoomNavContains(roomName)) {
        let item = document.createElement('li');
        item.textContent = roomName;
        ulRoomNav.appendChild(item);
    }
}

/**
 * Receives all chat messages from server
 */
socket.on('chat message', function (message) {
    appendMsg(message, mainWindow);
});

socket.on('private message', function (data) {
    console.log('private message data: ' + data);
    let fromName = data.from.username;
    let fromWindow = appendWindowToChatRoom(fromName);
    addRoom(fromName);
    appendMsg(data.message, fromWindow);
});

socket.on('group message', function(data) {
    console.log('group message data: ' + data);
    let groupName = data.groupName;
    let groupWindow = appendWindowToChatRoom(groupName);
    addRoom(groupName);
    appendMsg(data.message, groupWindow);
});

socket.on('group invite', function (groupName) {
    console.log(groupName);
    socket.emit('group invite', groupName);
    appendWindowToChatRoom(groupName);
    addRoom(groupName);
});

/**
 * Receives all messages from server
 */
socket.on('information', function (message) {
    appendMsg(message, mainWindow);
});

/**
 * Appends passed message msg to chat.html
 * @param msg
 */
function appendMsg(msg, window) {
    let item = document.createElement('li');
    item.innerHTML = msg.username + ' ' + msg.time + '<br>' + msg.message;
    window.appendChild(item);
    window.scrollTop = activeWindow.scrollHeight;
}

/**
 * Socket listens on server messages for new logged in users
 */
socket.on('updateUserList', function (backendUserList) {
    ulUser.innerHTML = '';
    updateUser(backendUserList);
});

/**
 * Sets the username and later in the project gets the profile picture from the server
 */
socket.on('init', function (username) {
    aUsername.innerText = username;
});

/**
 * Updates the current logged in User List on the View
 * @param backendUserList from server received user list.
 */
function updateUser(backendUserList) {
    users = backendUserList;
    backendUserList.forEach(user => {
        let userListElement = document.createElement('li');
        userListElement.textContent = user.username;
        ulUser.appendChild(userListElement);
    });
}

/**
 * Searches ulRoomNav for a specific roomName
 * @param roomName: the roomName we are looking for
 * @returns true if ulRoomNav contains the passed username
 */
function ulRoomNavContains(roomName) {
    let rooms = ulRoomNav.getElementsByTagName('li');
    let contains = false;
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].textContent === roomName) {
            contains = true;
            break;
        }
    }
    return contains;
}

/**
 * Searches ulUser for a specific username
 * @param username: the username we are looking for
 * @returns true if ulUser contains the passed username
 */
function ulUserContains(username) {
    let users = ulUser.getElementsByTagName('li');
    let contains = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].textContent === username) {
            contains = true;
            break;
        }
    }
    return contains;
}

/**
 * Returnes the value from the passed url key.
 * For example www.localhost:8080/chat/username=admin, if you pass username, admin gets returned
 * @param element
 * @returns {string}
 */
function getFromUri(element) {
    const urlParam = new URLSearchParams(window.location.search);
    return urlParam.get(element);
}

/**
 * Searches the logged in user list for a given username
 * @param username: the username we are looking for
 * @returns
 */
function getUserFromUsername(username) {
    return users.find(user => user.username === username);
}


/* Modal Window */

let modal = document.getElementById("modalWindow");
let btnAddGroup = document.getElementById('btnAddGroup');
let btnCreateGroup = document.getElementById('createGroup');
let btnClose = document.getElementById('spanClose');
let inputGroupName = document.getElementById('inputGroupName');
let userSelection = document.getElementById('userSelection');

btnAddGroup.onclick = function() {
    userSelection.innerHTML = '';
    console.log(users);
    for(let i = 0; i < users.length; i++) {
        let input = document.createElement("input")
        input.id = users[i].username;
        input.type = "checkbox";
        input.value = users[i].username;
        let label = document.createElement("Label");
        label.innerText = users[i].username;
        label.htmlFor = input.id;
        userSelection.appendChild(input);
        userSelection.appendChild(label);
        userSelection.appendChild(document.createElement("br"));
    }
    modal.style.display = "block";
}
btnClose.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if(event.target == modal) {
        modal.style.display ="none";
    }
}

btnCreateGroup.onclick = function() {
    let checkedUsers = [];
    let checkedElements = userSelection.querySelectorAll('input[type=checkbox]:checked');
    for(let i = 0; i < checkedElements.length; i++) {
        checkedUsers.push(getUserFromUsername(checkedElements[i].value));
    }
    let groupName = inputGroupName.value;
    console.log(checkedUsers);
    socket.emit('createGroup', {groupName: groupName, groupUser: checkedUsers});
    modal.style.display = "none";
}