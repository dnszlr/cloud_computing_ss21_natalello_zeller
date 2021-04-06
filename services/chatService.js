let users = [...new Set()];

/**
 * Adds a new user to the current logged in userList
 * @param id
 * @param username
 * @returns the new added user
 */
function addUser(id, username) {
    const user = {id, username};
    let existingUserIndex = users.indexOf(users.find(user => user.username === username));
    if (existingUserIndex != -1) {
        users[existingUserIndex] = user;
    } else {
        users.push(user);
    }
    return user;
}

/**
 * Returns the user who has the passed it.
 * @param id: the id of the searched user
 * @returns User or null
 */
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

/**
 *
 * @returns All users who are currently logged in.
 */
function getAllUsers() {
    return users;
}

module.exports = {
    addUser,
    getCurrentUser,
    getAllUsers
}