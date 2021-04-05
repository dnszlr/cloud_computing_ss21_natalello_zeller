const User = require('../models/user');

class UserService {

    /**
     * Adds a new user to the database
     * @param data: the data passed by the request body to the service.
     * @param callback
     * @returns {Promise<void>}
     */
    async add(data, callback) {
        await User.create(data, function (err, user) {
            if (err) {
                // error occurred while generating user, pass error to callback function
                console.log("There was a problem generating a user: " + err);
                callback(err);
            } else {
                // pass generated user to callback function
                console.log("User was successfully generated: " + user);
                callback(null, user);
            }
        });
    }

    /**
     * Finds all Users in the databse
     * @returns {Promise<*>}
     */
    async getAll() {
        return User.find()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    /**
     * Find User by Username and Password in the databse
     * @param username
     * @param callback
     * @returns {Promise<void>}
     */
    async getByUsername(username, callback) {
        await User.findOne({username: username}, function (err, user) {
            if (err) {
                // There was a problem finding a user
                console.log("There was a problem finding a user by username " + username + ": " + err);
                callback(err);
            } else if (user) {
                console.log("User was found: " + user);
                callback(null, user);
            } else {
                console.log("No user was found by username: " + username);
                callback();
            }
        });
    }

    async getById(id, callback) {
        await User.findById({id: id}, function (err, user) {
            if (err) {
                // There was a problem finding a user
                console.log("There was a problem finding a user by id " + id + ": " + err);
                callback(err);
            } else if (user) {
                console.log("User was found: " + user);
                callback(null, user);
            } else {
                console.log("No user was found by id: " + id);
                callback();
            }
        });
    }
}

module.exports = new UserService();