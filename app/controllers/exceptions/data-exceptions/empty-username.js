const UserError = require('./user-error');

class EmptyUsername extends UserError {
    constructor() {
        super('Username cannot be empty', 11);
    }
}

module.exports = EmptyUsername;
