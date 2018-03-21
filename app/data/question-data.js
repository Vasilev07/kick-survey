const Data = require('./data-generic');
const {
    Type,
    Question,
} = require('../db/models');

class QuestionData extends Data {
    constructor() {
        super(Question);
    }

    async getSurveyQuestions(surveyId) {
        return await this.Model.findAll({
            where: {
                survey_id: surveyId,
            },
            include: [Type],
        });
    }
}

module.exports = {
    QuestionData,
};
