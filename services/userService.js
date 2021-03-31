/**
 Service for User Collection
 **/

const User = require('../models/user');

class UserService {

    // Adds a new User
    async add(data) {
        const user = new User(data);
        user.save()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Gets all Users
    async getAll() {
        return User.find()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Gets User by Username and Password
    async getByUsername(username, callback) {
        await User.findOne({username: username},  function (err, user) {
            if (err) {
                callback(err);
            } else if (user) {
                callback(null, user);
            } else {
                callback();
            }
        });
    }
}

module.exports = new UserService();