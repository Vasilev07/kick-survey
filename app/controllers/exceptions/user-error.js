class UserError {
    constructor(message, errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }

    getError() {
        return {
            message: this.message,
            errorCode: this.errorCode,
        };
    }
}

module.exports = UserError;
