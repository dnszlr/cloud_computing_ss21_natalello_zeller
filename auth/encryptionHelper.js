const bcrypt = require('bcrypt');
const encryptionParam = 10;

exports.encrypt = async function(password) {
    const salt = await bcrypt.genSalt(encryptionParam);
    let encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
}

exports.verify = async function(givenPassword, storedPassword) {
    return bcrypt.compare(givenPassword, storedPassword);
}