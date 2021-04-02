const bcrypt = require('bcrypt');
const encryptionParam = 10;

module.exports = {
    getBcrypt: () => {
        return bcrypt;
    },
    getEncryptionParam: () => {
        return encryptionParam;
    }
}