let users = [...new Set()];

/**
 * Adds a new user to the current logged in userList
 * @param id
 * @param username
 * @returns the new added user
 */
function addUser(id, username) {
    const user = {id, username};
    if (!users.includes(user)) {
        return users.push(user);
    }
}

/**
 * Removes the user with the passed id
 * @param id
 */
async function removeUser(id) {
    const userToDeleteIndex = await users.findIndex(user => user.id == id);
    users.splice(userToDeleteIndex, 1);
}

/**
 * Returns the user who has the passed it.
 * @param id: the id of the searched user
 * @returns User or null
 */
function getUserById(id) {
    return users.find(user => user.id === id);
}

function getByUsername(username) {
    return users.find(user => user.username === username);
}

/**
 * @returns All users who are currently logged in.
 */
function getAllUsers() {
    return users;
}

/**
 * Resets the the list holding the currently logged in users.
 * @param serverUserSets
 */
function resetList() {
    users = [...new Set()];
}

module.exports = {
    addUser,
    removeUser,
    getUserById,
    getByUsername,
    getAllUsers,
    resetList
}