const UserError = require('./user-error');

class NullEmail extends UserError {
    constructor() {
        super('getAllEmails returns null', 33);
    }
}

module.exports = NullEmail;
