const UserError = require('./user-error');

class NotMatchingPasswords extends UserError {
    constructor() {
        super('Password do not match', 20);
    }
}

module.exports = NotMatchingPasswords;
