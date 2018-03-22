const UserError = require('./user-error');

class ExistingUsername extends UserError {
    constructor() {
        super('This username already exists', 10);
    }
}

module.exports = ExistingUsername;
