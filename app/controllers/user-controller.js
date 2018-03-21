const bcrypt = require('bcrypt');
const UserError = require('./userError');

class UserController {
    constructor(data) {
        this.data = data;
    }

    hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async createUser(user) {
        let password;
        let hashedPassword;
        let username;
        let email;

        try {
            password = this.validatePasswords(user.password);
        } catch (err) {
            throw new Error(err);
        }

        try {
            hashedPassword = this.hashPassword(password);
        } catch (err) {
            throw new Error(err);
        }

        try {
            username = this.validateUsername(user.username);
        } catch (err) {
            throw new Error(err);
        }

        try {
            email = this.validateUserEmail(user.email);
        } catch (err) {
            throw new Error(err);
        }

        const firstName = user.firstName;
        const lastName = user.lastName;

        const userObject = {
            username,
            password: await hashedPassword,
            firstName,
            lastName,
            email,
        };

        // this.data.users.create(userObject);
    }
}

module.exports = UserController;
