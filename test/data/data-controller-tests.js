const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const DataController = require('../../app/controllers/data-controller');

let surveysArray = [];
let questionsArray = [];
let answersArray = [];
let categoriesArray = [];
let typesArray = [];

const fakeData = {
    surveys: {
        getSurvey(userId, name) {
            const result = surveysArray.find((survey) => {
                    return +survey.user_id === +userId &&
                        survey.name === name;
                }

            );
            result.dataValues = {};
            return result;
        },
        getUserSurveys(id) {
            const found =
                surveysArray.filter((survey) => survey.user_id === id);
            if (!found) {
                return [];
            }
            return found;
        },
    },
    questions: {
        getSurveyQuestions(id) {
            const found =
                questionsArray.find((survey) => survey.id === id);
            if (!found) {
                return [];
            }
            return [found];
        },
    },
    answers: {
        getQuestionAnswers(id) {
            const found =
                answersArray.filter((answer) => answer.q_id === id);
            if (!found) {
                return [];
            }
            return found;
        },
    },
    categories: {
        getAll() {
            return categoriesArray;
        },
    },
    types: {
        getAll() {
            return typesArray;
        },
    },
};

describe('DataController', () => {
    describe('getUserSurveysData()', () => {
        describe('when data is valid', () => {
            it('expect to return an array of objects', async () => {
                const user = {
                    id: 1,
                };
                surveysArray = [{
                    id: 1,
                    user_id: 1,
                    name: 'survey name',
                    createdAt: 'some date',
                    Category: {
                        name: 'category',
                    },
                }];
                questionsArray = [{
                    id: 1,
                    survey_id: 1,
                    order: 1,
                    name: 'question name',
                    is_required: 0,
                    type_id: 1,
                    Type: {
                        name: 'some type',
                    },
                }];

                const controller = new DataController(fakeData);

                const data = await controller.getUserSurveysData(user);

                return expect(data).to.be.instanceOf(Array)
                    .and.not.to.include(null);
            });
        });
        describe('when data is invalid', () => {
            it('expect to return an array of objects', async () => {
                const user = {
                    id: 1,
                };
                surveysArray = [{
                    id: 1,
                    user_id: 2,
                    name: 'survey name',
                    createdAt: 'some date',
                    Category: {
                        name: 'category',
                    },
                }];
                questionsArray = [{
                    id: 1,
                    survey_id: 1,
                    order: 1,
                    name: 'question name',
                    is_required: 0,
                    type_id: 1,
                    Type: {
                        name: 'some type',
                    },
                }];

                const controller = new DataController(fakeData);

                const data = await controller.getUserSurveysData(user);

                return expect(data).to.be.instanceOf(Array)
                    .and.not.to.include(null);
            });
        });
    });
    describe('_extractAnswers()', () => {
        describe('when data is valid', () => {
            it('expect ti return an array of objects', async () => {
                answersArray = [{
                    id: 1,
                    q_id: 1,
                    answer_name: 'some answer',
                }];
                const question = {
                    id: 1,
                    name: 'some question',
                };

                const controller = new DataController(fakeData);

                const result = await controller._extractAnswers(question);

                expect(result[0]).to.
                deep.equal({
                    answerId: 1,
                    answer: 'some answer',
                });
            });
        });
        describe('when data is invalid', () => {
            it('expect ti return empty array', async () => {
                answersArray = [{
                    id: 1,
                    q_id: 1,
                    answer_name: 'some answer',
                }];
                const question = {
                    id: 2,
                    name: 'some question',
                };

                const controller = new DataController(fakeData);

                const result = await controller._extractAnswers(question);

                expect(result).to.be.empty.and.to.be.instanceof(Array);
            });
        });
    });
    describe('_extractQuestions()', () => {
        describe('when data is valid', () => {
            it('expect to return an array of objects', async () => {
                questionsArray = [{
                    id: 1,
                    order: 1,
                    name: 'some question',
                    is_required: 0,
                    Type: {
                        q_type: 'some type',
                    },
                }];
                answersArray = [{
                    id: 1,
                    q_id: 1,
                    answer_name: 'some answer',
                }];

                const controller = new DataController(fakeData);

                const result =
                    await controller._extractQuestions(questionsArray);

                expect(result).to.be.instanceOf(Array);
                expect(result[0]).to.have.property('questionData');
                expect(result[0]).to.have.property('answersData');
            });
        });
        describe('when data is invalid', () => {
            describe('when the ids does not match', () => {
                it('expect to return object with empty answersData',
                    async () => {
                        questionsArray = [{
                            id: 1,
                            order: 1,
                            name: 'some question',
                            is_required: 0,
                            Type: {
                                q_type: 'some type',
                            },
                        }];
                        answersArray = [{
                            id: 1,
                            q_id: 2,
                            answer_name: 'some answer',
                        }];

                        const controller = new DataController(fakeData);

                        const result =
                            await controller._extractQuestions(questionsArray);

                        return expect(result[0]).to.have.property('answersData')
                            .and.to.be.empty;
                    });
            });
        });
    });
    describe('getUserSurveyData()', () => {
        describe('when data is valid', () => {
            it('expect to return array of surveys', async () => {
                const encryptedUrl = 'be18d21bc24ea961b7';
                surveysArray = [{
                    id: 1,
                    user_id: 1,
                    name: 'survey',
                    Category: {
                        name: 'some category',
                    },
                }];
                questionsArray = [{
                    id: 1,
                    order: 1,
                    name: 'some question',
                    is_required: 0,
                    survey_id: 1,
                    Type: {
                        q_type: 'some type',
                    },
                }];
                answersArray = [{
                    id: 1,
                    q_id: 1,
                    answer_name: 'some answer',
                }];

                const controller = new DataController(fakeData);

                const result = await controller.getUserSurveyData(encryptedUrl);

                expect(result).to.have.property('Category')
                    .and.to.have.property('name')
                    .and.to.equal(surveysArray[0].Category.name);
                expect(result).to.have.property('dataValues')
                    .and.to.have.property('surveyContentData')
                    .and.to.be.instanceOf(Array);
            });
        });
    });
    describe('getAllCategories()', () => {
        it('expect to return array of categories', () => {
            categoriesArray = [
                'category-1',
            ];

            const controller = new DataController(fakeData);

            const result = controller.getAllCategories();

            expect(result).to.be.deep.equal(categoriesArray);
        });
    });
    describe('getAllQuestionTypes()', () => {
        it('expect to return array of types', () => {
            typesArray = [
                'type-1',
            ];

            const controller = new DataController(fakeData);

            const result = controller.getAllQuestionTypes();

            expect(result).to.be.deep.equal(typesArray);
        });
    });
});
