const Data = require('./data-generic');
const {
    User,
} = require('../db/models');

class UsersData extends Data {
    constructor() {
        super(User);
    }

    findByUsername(username) {
        return this.Model.findOne({
            where: {
                username,
            },
        });
    }
    getAllUsernames() {
        return this.Model.findAll({
            attributes: ['username'],
        });
    }
    getAllEmails() {
        return this.Model.findAll({
            attributes: ['email'],
        });
    }
}

module.exports = {
    UsersData,
};

