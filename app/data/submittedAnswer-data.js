const Data = require('./data-generic');
const {
    SubmittedAnswer,
} = require('../db/models');

class SubmittedAnswerData extends Data {
    constructor() {
        super(SubmittedAnswer);
    }

    getUserSurveys(userId) {
        return this.Model.findAll({
            where: {
                user_id: userId,
            },
        });
    }
    
    getUniqueSubmitions() {
        return this.Model.aggregate('createdAt', 'DISTINCT', {
            plain: false,
        });
    }
}

module.exports = {
    SubmittedAnswerData,
};
