const ExistingUsername = require('./existing-username');
const EmptyUsername = require('./empty-username');
const ExistingEmail = require('./existing-email');
const EmptyEmail = require('./empty-email');
const InvalidEmail = require('./invalid-email');
const ShortPassword = require('./short-password');
const NotMatchingPasswords = require('./not-matching-passwords');

module.exports = {
    ExistingUsername,
    EmptyUsername,
    ExistingEmail,
    EmptyEmail,
    InvalidEmail,
    ShortPassword,
    NotMatchingPasswords,
};

