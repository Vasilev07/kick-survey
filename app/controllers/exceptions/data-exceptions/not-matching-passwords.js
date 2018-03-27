const UserError = require('./user-error');

class NotMatchingPasswords extends UserError {
    constructor() {
        super('Passwords do not match', 20);
    }
}

module.exports = NotMatchingPasswords;
