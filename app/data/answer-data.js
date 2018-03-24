const Data = require('./data-generic');

class AnswerData extends Data {
    constructor(Answer) {
        super(Answer);
    }

    async getQuestionAnswers(questionId) {
        return this.Model.findAll({
            where: {
                q_id: questionId,
            },
        });
    }
}

module.exports = AnswerData;
