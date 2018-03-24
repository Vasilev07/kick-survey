const Data = require('./data-generic');
const {
    Type,
} = require('../db/models');

class QuestionData extends Data {
    constructor(Question) {
        super(Question);
    }

    async getSurveyQuestions(surveyId) {
        return this.Model.findAll({
            where: {
                survey_id: surveyId,
            },
            include: [Type],
        });
    }
}

module.exports = QuestionData;
