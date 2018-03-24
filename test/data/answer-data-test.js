const {
    expect,
} = require('chai');

const AnswerData = require('../../app/data/answer-data');

const Model = {
    findAll: () => [{
        id: 1,
    }],
};

describe('Testing getQuestionsAnswers() from AnswerData', () => {
    describe('with valid ', () => {
        it('id and expect to return array of objects', async () => {
            const answer = new AnswerData(Model);
            const realResult = await answer.getQuestionAnswers(1);
            const expectedResult = [{
                id: 1,
            }];

            expect(realResult.id).to.be.equal(expectedResult.id);
        });
    });
});
