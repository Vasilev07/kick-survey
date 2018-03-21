const UserError = require('./user-error');

class ShortPassword extends UserError {
    constructor() {
        super('Password must be at least 5 symbols', 21);
    }
}

module.exports = ShortPassword;
