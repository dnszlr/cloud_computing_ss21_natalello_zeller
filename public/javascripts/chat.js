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
let clientUsername = getFromUri('username');
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
    socket.emit('tellUsername', clientUsername);
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
    highlightSelection(roomName);
});

function highlightSelection(roomName) {
    let liList = ulRoomNav.getElementsByTagName('li');
    console.log(liList);
    for(let li in liList) {
        console.log(liList[li].id +  ' | ' + roomName);
        liList[li].id === roomName ? liList[li].className = 'roomNavLiSelected' : liList[li].className = 'roomNavLi'
    }
}

/**
 * Adds clickListener to user list to append a new chat window on click
 */
ulUser.addEventListener('click', function (userListElement) {
    let username = userListElement.target.textContent;
    if (ulUserContains(username) && username != clientUsername) {
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
        if (activeWindow === mainWindow) {
            console.log("public message");
            socket.emit('chat message', {
                message: inputChat.value,
                fileType: "text"
            });
        } else if (ulUserContains(activeWindow.id)) {
            console.log("private message");
            socket.emit('private message', {
                message: inputChat.value,
                from: getUserFromUsername(clientUsername),
                to: getUserFromUsername(activeWindow.id),
                fileType: "text"
            });
        } else {
            console.log(activeWindow.id);
            socket.emit('group message', {
                message: inputChat.value,
                groupName: activeWindow.id,
                fileType: "text"
            });
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
        item.id = roomName;
        item.className = 'roomNavLi';
        item.textContent = roomName;
        ulRoomNav.appendChild(item);
    }
}

/**
 * Receives all chat messages from server
 */
socket.on('chat message', function (data) {
    console.log('chat message data: ' + data);
    console.log(data);
    appendMsg(data, mainWindow);
});

socket.on('private message', function (data) {
    console.log('private message data: ' + data);
    let fromName = data.payload.from.username;
    let fromWindow = appendWindowToChatRoom(fromName);
    addRoom(fromName);
    appendMsg(data, fromWindow);
});

socket.on('group message', function (data) {
    console.log(data);
    let groupName = data.payload.groupName;
    let groupWindow = appendWindowToChatRoom(groupName);
    addRoom(groupName);
    appendMsg(data, groupWindow);
});

socket.on('group invite', function (groupName) {
    console.log(groupName);
    socket.emit('group invite', groupName);
    appendWindowToChatRoom(groupName);
    addRoom(groupName);
});

socket.on('profilePicture', function(data){
    console.log(data);
    document.getElementById('btnProfilePicture').style.backgroundImage = data;
});

/**
 * Receives all messages from server
 */
socket.on('information', function (data) {
    appendMsg(data, mainWindow);
});

/**
 * Appends passed message msg to chat.html
 * @param msg
 */
function appendMsg(data, window) {
    let item = document.createElement('li');
    console.log(data);
    let header = data.header.username + ' ' + data.header.time + '<br>';
    if (data.payload.fileType === 'text') {
        item.innerHTML = header + data.payload.message;
    } else {
        console.log(data.payload.fileType);
        item.innerHTML = header;
        if (data.payload.fileType === 'video') {
            console.log("im in video");
            let player = document.createElement('video');
            player.id = 'video-player';
            player.controls = 'controls';
            player.src = data.payload.file;
            player.type = 'video/*';
            player.width = 500;
            player.height = 500;
            item.appendChild(player);
        } else if (data.payload.fileType === 'audio') {
            console.log("im in audio");
            let player = document.createElement('audio');
            player.id = 'audio-player';
            player.controls = 'controls';
            player.src = data.payload.file;
            player.type = 'audio/*';
            item.append(player);
        } else if (data.payload.fileType === 'image') {
            console.log("im in image");
            const image = new Image();
            image.src = data.payload.file;
            image.width = 500;
            image.heigh = 500;
            item.appendChild(image);
        }
    }
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

/* File handling */
let btnFile = document.getElementById('btnFile');
let inputFile = document.getElementById('inputFile');

btnFile.addEventListener('click', function (event) {
    event.preventDefault();
    inputFile.click();
});

inputFile.addEventListener('change', async function (event) {
    event.preventDefault();
    const fileList = event.target.files;
    let fileUpload = fileList[0];
    if (fileUpload.size > 1048576) {
        alert("Files with only less than 1mb are allowed!");
    } else {
        let fileBase64 = await fileToBase64(fileUpload);
        console.log(fileBase64);
        if (fileBase64) {
            let baseType = fileUpload.type.split('/')[0];
            console.log(baseType);
            if (activeWindow === mainWindow) {
                console.log("public file message");
                socket.emit('chat message', {
                    file: fileBase64,
                    fileType: baseType,
                    fileName: fileUpload.name
                });
                console.log("public file message emit");
            } else if (ulUserContains(activeWindow.id)) {
                console.log("private file message");
                socket.emit('private message', {
                    file: fileBase64,
                    fileType: baseType,
                    from: getUserFromUsername(clientUsername),
                    to: getUserFromUsername(activeWindow.id),
                    fileName: fileUpload.name
                });
            } else {
                console.log(activeWindow.id);
                socket.emit('group message', {
                    file: fileBase64,
                    fileType: baseType,
                    groupName: activeWindow.id,
                    fileName: fileUpload.name
                });
            }
        }
    }
});

/**
 * Converts the passed file to base64
 * @param file
 * * @returns a new to base64 converted file.
 */
const fileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
});

/* Modal Window */
let modal = document.getElementById("modalWindow");
let btnAddGroup = document.getElementById('btnAddGroup');
let btnCreateGroup = document.getElementById('createGroup');
let btnClose = document.getElementById('spanClose');
let inputGroupName = document.getElementById('inputGroupName');
let userSelection = document.getElementById('userSelection');

btnAddGroup.onclick = function () {
    userSelection.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        if (users[i].username != clientUsername) {
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
    }
    modal.style.display = "block";
}
btnClose.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

btnCreateGroup.onclick = function () {
    let checkedUsers = [];
    let checkedElements = userSelection.querySelectorAll('input[type=checkbox]:checked');
    for (let i = 0; i < checkedElements.length; i++) {
        checkedUsers.push(getUserFromUsername(checkedElements[i].value));
    }
    checkedUsers.push(getUserFromUsername(clientUsername));
    let groupName = inputGroupName.value;
    if (!groupName) {
        alert("Please choose a name for the new group");
    } else if (checkedUsers.length <= 1) {
        alert("Please select atleast one user for the new group");
    } else {
        console.log(checkedUsers);
        socket.emit('createGroup', {groupName: groupName, groupUser: checkedUsers});
        modal.style.display = "none";
    }
}