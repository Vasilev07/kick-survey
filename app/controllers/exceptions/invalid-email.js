const UserError = require('./user-error');

class InvalidEmail extends UserError {
    constructor() {
        super('This is not valid email', 33);
    }
}

module.exports = InvalidEmail;
