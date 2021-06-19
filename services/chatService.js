let users = [...new Set()];

/**
 * Adds a new user to the current logged in userList
 * @param id
 * @param username
 * @returns the new added user
 */
function addUser(user) {
    if(getUserById(user.id) === undefined){
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
 * Merges incoming user sets from other sets with own set.
 * @param serverUserSets
 */
async function mergeUserSet(mergeSet) {
    if(mergeSet) {
        mergeSet.forEach(user => {
            if(!users.includes(user)) {
                users.add(user);
            }
        });
    }

}

module.exports = {
    addUser,
    removeUser,
    getUserById,
    getByUsername,
    getAllUsers,
    mergeUserSet
}