const bcrypt = require('bcrypt');
const UserError = require('./exceptions');

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
        let password = null;
        let hashedPassword = null;
        let username = null;
        let email = null;

        try {
            password = this.validatePasswords(user.password, user.rePassword);
        } catch (err) {
            throw err;
        }

        try {
            hashedPassword = this.hashPassword(password);
        } catch (err) {
            throw err;
        }

        try {
            username = this.validateUsername(user.username);
        } catch (err) {
            throw err;
        }

        try {
            email = this.validateUserEmail(user.email);
        } catch (err) {
            throw err;
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
        // console.log(userObject);
        this.data.users.create(userObject);
    }

    async validateUserEmail(currentUserEmail) {
        const usersEmailArray = [];

        await this.data.users.getAllEmails().map(async (userData) => {
            await usersEmailArray.push(userData.email);
        });

        const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const validateEmail = pattern.test(currentUserEmail);

        if (usersEmailArray.includes(currentUserEmail)) {
            throw new UserError.ExistingEmail();
        } else if (validateEmail === false) {
            throw new UserError.InvalidEmail();
        } else if (currentUserEmail === '') {
            throw new UserError.EmptyEmail();
        } else {
            return currentUserEmail;
        }
    }

    async validateUsername(currentUsername) {
        const usernameArray = [];

        await this.data.users.getAllUsernames().map(async (userData) => {
            await usernameArray.push(userData.username);
        });

        if (usernameArray.includes(currentUsername)) {
            throw new UserError.ExistingUsername();
        } else if (usernameArray === '') {
            throw new UserError.EmptyUsername();
        } else {
            return currentUsername;
        }
    }

    validatePasswords(password, repassword) {
        if (password !== repassword) {
            throw new UserError.NotMatchingPasswords();
        } else if (password.length < 4) {
            throw new UserError.ShortPassword();
        } else {
            return password;
        }
    }
}

module.exports = UserController;
