const Data = require('./data-generic');
const {
    Answer,
} = require('../db/models');

class AnswerData extends Data {
    constructor() {
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

module.exports = {
    AnswerData,
};
