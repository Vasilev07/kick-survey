const UserError = require('./user-error');

class EmptyEmail extends UserError {
    constructor() {
        super('Email cannot be empty', 31);
    }
}

module.exports = EmptyEmail;
