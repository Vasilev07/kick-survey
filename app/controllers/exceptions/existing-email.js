const UserError = require('./user-error');

class ExistingEmail extends UserError {
    constructor() {
        super('This email already exists', 30);
    }
}

module.exports = ExistingEmail;
