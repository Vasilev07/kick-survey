const UserError = require('./user-error');

class NullUsername extends UserError {
    constructor() {
        super('getAllUsernames returns null', 12);
    }
}

module.exports = NullUsername;
