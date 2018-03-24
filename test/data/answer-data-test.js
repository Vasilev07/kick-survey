const {
    expect,
} = require('chai');

const AnswerData = require('../../app/data/answer-data');

const Model = {
    findAll: (id) => {
        const arr = [{
                q_id: 1,
            },
            {
                q_id: 2,
            },
        ];
        return [...arr.filter((obj) => obj.id === id)];
    },
};
const answers = new AnswerData(Model);

describe('Testing getQuestionsAnswers() from AnswerData', () => {
    describe('with valid ', () => {
        it('id - expect to return array of obj with specific id', async () => {
            const realResult = await answers.getQuestionAnswers(1);
            const expectedResult = [{
                id: 1,
            }];

            expect(realResult.id).to.be.equal(expectedResult.id);
        });
        it('id and expects to return array', async () => {
            const realResult = await answers.getQuestionAnswers(1);

            expect(realResult).to.be.an('array');
        });
    });
    describe('when invalid', () => {
        it('without passed id expect empty array', async () => {
            const result = await answers.getQuestionAnswers();
            expect(result).to.deep.equal([]);
        });
        it('with non-existent id expect an empty array', async () => {
            const result = await answers.getQuestionAnswers(22);

            expect(result).to.deep.equal([]);
        });
    });
});