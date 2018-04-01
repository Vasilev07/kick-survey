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
        return this.Model.findAll({
            where: {
                survey_id: surveyId,
            },
            include: [Type],
        });
    }
    async getQuestionById(questionId) {
        return this.Model.findAll({
            where: {
                id: questionId,
            },
        });
    }
}

module.exports = {
    QuestionData,
};
// const constrol = new QuestionData();
// const run = async () => {
//     const res = await constrol.getQuestionById(1);
//     console.log(res);
// }
// run()