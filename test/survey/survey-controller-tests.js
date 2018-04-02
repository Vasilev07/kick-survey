const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const SurveyController = require('../../app/controllers/survey-controller');

let questionsArray = [];
let answersArray = [];
let categoriesArray = [];
let typesArray = [];

const fakeData = {
    surveys: {
        create(obj) {
            if (obj === null || typeof obj === 'undefined') {
                throw new Error('Invalid object');
            }
            return obj;
        },
    },
    questions: {
        create(obj) {
            if (obj === null || typeof obj === 'undefined') {
                throw new Error('Invalid object');
            }
            return obj;
        },
    },
    answers: {
        create(obj) {
            if (obj === null || typeof obj === 'undefined') {
                throw new Error('Invalid object');
            }
            return obj;
        },
    },
    categories: {
        getByCategoryName(catName) {
            return categoriesArray.find((cat) => cat.name === catName);
        },
    },
    types: {
        getByTypeName(typeName) {
            return typesArray.find((type) => type.name === typeName);
        },
    },
};

describe('DataController', () => {
    describe('_createAnswer() when data is valid', () => {
        describe('when argument answer_data is Array', () => {
            it('expect to return true', async () => {
                answersArray = [{
                    answer_name: 'answer1',
                }];
                const createdQuestion = {
                    id: 1,
                };

                const controller = new SurveyController(fakeData);

                const result = await controller
                    ._createAnswer(answersArray, createdQuestion);

                return expect(result).to.be.true;
            });
        });
        describe('when argument answer_data is String', () => {
            it('expect to return true', async () => {
                answersArray = '';
                const createdQuestion = {
                    id: 1,
                };

                const controller = new SurveyController(fakeData);

                const result = await controller
                    ._createAnswer(answersArray, createdQuestion);

                return expect(result).to.be.true;
            });
        });
    });
    describe('_createQuestion() when data is valid', () => {
        it('expect to return true', async () => {
            typesArray = [{
                name: 'type',
                id: 1,
            }];
            answersArray = [{
                answer_name: 'answer1',
                q_id: 1,
            }];
            questionsArray = [{
                id: 1,
                order: 2,
                name: 'name',
                is_required: 1,
                questionType: 'type',
            }];
            const createdSurvey = {
                id: 1,
            };

            const controller = new SurveyController(fakeData);

            const result = await controller
                ._createQuestion(questionsArray, createdSurvey);

            return expect(result).to.be.true;
        });
    });
    describe('createSurvey() when data is valid', () => {
        it('expect to return true', async () => {
            questionsArray = [{
                id: 1,
                order: 2,
                name: 'name',
                is_required: 1,
                questionType: 'type',
            }];
            const surveyData = {
                category: 'cat',
                surveyName: 'survey',
                user: {
                    id: 1,
                },
                questionData: questionsArray,
            };
            categoriesArray = [{
                name: 'cat',
                id: 1,
            }];
            typesArray = [{
                name: 'type',
                id: 1,
            }];
            answersArray = [{
                answer_name: 'answer1',
                q_id: 1,
            }];

            const controller = new SurveyController(fakeData);

            const result = await controller
                .createSurvey(surveyData);

            return expect(result).to.be.true;
        });
    });
});
