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

    getUniqueSubmissions() {
        return this.Model.aggregate('createdAt', 'DISTINCT', {
            plain: false,
        });
    }

    countUniqueSubmits(userId, surveyId) {
        return this.Model.count({
            col: 'submit_identifier',
            distinct: true,
            where: {
                user_id: userId,
                survey_id: surveyId,
            },
        });
    }
}

module.exports = {
    SubmittedAnswerData,
};
