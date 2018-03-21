class UserController {
    constructor(data) {
        this.data = data;
    }

    async validateUserEmail(currentUserEmail) {
        const usersEmailArray = [];

        await this.data.users.getAllEmails().map(async (userData) => {
            await usersEmailArray.push(userData.email);
        });

        const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const validateEmail = pattern.test(currentUserEmail);

        if (usersEmailArray.includes(currentUserEmail)) {
            throw new Error('This email already exists');
        } else if (validateEmail === false) {
            throw new Error('This is not valid email');
        } else if (currentUserEmail === '') {
            throw new Error('Email must not be empty');
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
            throw new Error('This username already exists');
        } else if (usernameArray === '') {
            throw new Error('Username must not be empty');
        } else {
            return currentUsername;
        }
    }

    validatePasswords(password, repassword) {
        if (password !== repassword) {
            throw new Error('Password do not match');
        } else if (password.length < 4) {
            throw new Error('Password must be atleast 5 symbols');
        } else {
            return password;
        }
    }

    createUser(user) {}
}

module.exports = UserController;
