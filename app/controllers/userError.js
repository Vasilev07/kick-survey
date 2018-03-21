class UserError {
    constructor(message) {
        this.message = message;
    }

    existingUsername() {
        return {
            message: this.message,
            type: this.existingUsername.name,
        };
    }

    emptyUsername() {
        return {
            message: this.message,
            type: this.emptyUsername.name,
        };
    }

    getError() {
        return {
            errorType: this.errorType,
            message: this.message,
        };
    }
}

module.exports = UserError;
