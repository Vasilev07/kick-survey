const UserError = require('./exceptions');
const Crypto = require('./cryptography-controller');

class UserController {
    constructor(data) {
        this.data = data;
    }
    /**
     * @description Creates a user entry in the database
     * @async
     * @throws Throws errors from the validations
     * @param {Object} user User object with properties from the register form
     * @return {Object} Created user
     */
    async createUser(user) {
        let password = null;
        let hashedPassword = null;
        let username = null;
        let email = null;
        const cryptography = new Crypto();
        try {
            try {
                username = await this.validateUsername(user.username);
            } catch (err) {
                throw err;
            }
            try {
                password =
                    this.validatePasswords(user.password, user.rePassword);
            } catch (err) {
                throw err;
            }

            try {
                hashedPassword = cryptography.hashPassword(password);
            } catch (err) {
                throw err;
            }

            try {
                email = await this.validateUserEmail(user.email);
            } catch (err) {
                throw err;
            }

            const firstName = user.firstName;
            const lastName = user.lastName;

            const userObject = {
                username,
                password: await hashedPassword,
                first_name: firstName,
                last_name: lastName,
                email,
            };

            return this.data.users.create(userObject);
        } catch (err) {
            throw err;
        }
    }
    /**
     * @description Checks whether the email is valid
     * @async
     * @throws {UserError}
     * @param {string} email String with a possible email
     * @return {UserError|string}
     */
    async validateUserEmail(email) {
        const usersEmailArray = [];
        try {
            await this.data.users.getAllEmails().map(async (userData) => {
                usersEmailArray.push(userData.email);
            });
        } catch (err) {
            throw new UserError.NullEmail();
        }

        const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const validateEmail = pattern.test(email);

        if (usersEmailArray.includes(email)) {
            throw new UserError.ExistingEmail();
        } else if (email === '') {
            throw new UserError.EmptyEmail();
        } else if (validateEmail === false) {
            throw new UserError.InvalidEmail();
        } else {
            return email;
        }
    }
    /**
     * @description Checks whether the username is valid
     * @async
     * @throws {UserError}
     * @param {string} username String with a possible username
     * @return {UserError|string}
     */
    async validateUsername(username) {
        const usernameArray = [];
        try {
            await this.data.users.getAllUsernames().map(async (userData) => {
                usernameArray.push(userData.username);
            });
        } catch (err) {
            throw new UserError.NullUsername();
        }


        if (usernameArray.includes(username)) {
            throw new UserError.ExistingUsername();
        } else if (username === '') {
            throw new UserError.EmptyUsername();
        } else {
            return username;
        }
    }

    /**
     * @description Checks whether the password is valid
     * @throws {UserError}
     * @param {string} password String with the password
     * @param {string} confirmPassword String with the confirmation password
     * @return {UserError|string}
     */
    validatePasswords(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new UserError.NotMatchingPasswords();
        } else if (password.length < 4) {
            throw new UserError.ShortPassword();
        } else {
            return password;
        }
    }
}

module.exports = UserController;
