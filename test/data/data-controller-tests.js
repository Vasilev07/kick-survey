/* globals Set */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const DataController = require('../../app/controllers/data-controller');
const SurveyError = require('../../app/controllers/exceptions/survey-exceptions');

let userArray = [];
let surveysArray = [];
let questionsArray = [];
let answersArray = [];
let categoriesArray = [];
let typesArray = [];
let submittedAnswersArray = [];

const fakeData = {
    users: {
        getAll() {
            return userArray;
        },
    },
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
        deleteSurvey(userId, name) {
            let indexToDelete = -1;
            name = name.split('&&')[0];
            surveysArray.map((survey, index) => {
                if (survey.name === name &&
                    survey.user_id === +userId) {
                    indexToDelete = index;
                }
            });

            const deleted = surveysArray.splice(indexToDelete, 1);

            if (indexToDelete === -1) {
                throw new SurveyError.SurveyNotFound();
            }
            return deleted;
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
        getAll() {
            return questionsArray;
        },
        // getById(id) {
        //     return questionsArray.find((question) => +question.id === +id);
        // },
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
    submittedAnswer: {
        countUniqueSubmits(userId, surveyId) {
            let counter = 0;
            submittedAnswersArray.forEach((submit) => {
                if (submit.user_id === userId &&
                    submit.survey_id === surveyId) {
                    counter += 1;
                }
            });

            return counter;
        },
        getUniqueSubmissions() {
            const uniqueArray = [...new Set(submittedAnswersArray)];
            return uniqueArray;
        },
    },
    categories: {
        getAll() {
            return categoriesArray;
        },
        getById(id) {
            return categoriesArray.find((category) => +category.id === +id);
        },
    },
    types: {
        getAll() {
            return typesArray;
        },
        getById(id) {
            return questionsArray.find((types) => +types.id === +id);
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
                submittedAnswersArray = [{
                    user_id: 1,
                    survey_id: 1,
                }];
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

    describe('deleteSurvey()', () => {
        describe('when data is valid', () => {
            it('expect to return the deleted entry', async () => {
                const url = 'be18d21bc24ea961b7f7f5b837404bf80cea1de361';
                surveysArray = [{
                    user_id: 1,
                    id: 1,
                    name: 'survey1',
                }];

                const copyArray = Array.from(surveysArray);

                const controller = new DataController(fakeData);

                const result = await controller.deleteSurvey(url);

                expect(result[0]).to.be.deep.equal(copyArray[0]);
            });
        });
        describe('when data is invalid', () => {
            it('expect to return throw SurveyNotFound exception', async () => {
                const url = 'be18d21bc24ea961b7f7f5b837404bf80cea1de361';
                surveysArray = [{
                    user_id: 2,
                    id: 1,
                    name: 'survey',
                }];

                const controller = new DataController(fakeData);
                const func = () => {
                    return controller.deleteSurvey(url);
                };

                expect(func())
                    .to.eventually
                    .be.rejectedWith('Survey not found')
                    .and.be.an.instanceOf(SurveyError.SurveyNotFound);
            });
        });
    });
    describe('counterArray()', () => {
        it('expect to return a map', () => {
            const array = [
                'answer1', 'answer2', 'answer1',
            ];

            const controller = new DataController(fakeData);

            const result = controller.counterArray(array);

            expect([...result][0]).to.include('answer1')
                .and.to.include(2);
        });
    });
    describe('getAllSubmissionsByDayOfWeek()', () => {
        it('expect to return an object with two arrays', async () => {
            submittedAnswersArray = [{
                DISTINCT: {
                    getDay() {
                        return this.date;
                    },
                    date: '2018-03-28T17:47:34.000Z',
                },
            }, {
                DISTINCT: {
                    getDay() {
                        return this.date;
                    },
                    date: '2018-03-28T17:47:34.000Z',
                },
            }];

            const controller = new DataController(fakeData);

            const result = await controller.getAllSubmissionsByDayOfWeek();

            expect(result)
                .to.have.property('label')
                .and.to.be.instanceof(Array);

            expect(result)
                .to.have.property('data')
                .and.to.be.instanceof(Array);
        });
    });
    describe('getAllSubmissionsByDate()', () => {
        it(`expect to return an object with 
        two arrays when day and month are greater than 10`, async () => {
            submittedAnswersArray = [{
                DISTINCT: {
                    getDate() {
                        return this.date;
                    },
                    getMonth() {
                        return this.month;
                    },
                    getFullYear() {
                        return this.year;
                    },
                    date: 10,
                    month: 10,
                    year: '1999',
                },
            }, {
                DISTINCT: {
                    getDate() {
                        return this.date;
                    },
                    getMonth() {
                        return this.month;
                    },
                    getFullYear() {
                        return this.year;
                    },
                    date: 11,
                    month: 11,
                    year: '1999',
                },
            }];

            const controller = new DataController(fakeData);

            const result = await controller.getAllSubmissionsByDate();

            expect(result)
                .to.have.property('label')
                .and.to.be.instanceof(Array);

            expect(result)
                .to.have.property('data')
                .and.to.be.instanceof(Array);
        });
        it(`expect to return an object with 
        two arrays when day and month are lower than 10`, async () => {
            submittedAnswersArray = [{
                DISTINCT: {
                    getDate() {
                        return this.date;
                    },
                    getMonth() {
                        return this.month;
                    },
                    getFullYear() {
                        return this.year;
                    },
                    date: 5,
                    month: 5,
                    year: '1999',
                },
            }, {
                DISTINCT: {
                    getDate() {
                        return this.date;
                    },
                    getMonth() {
                        return this.month;
                    },
                    getFullYear() {
                        return this.year;
                    },
                    date: 6,
                    month: 6,
                    year: '1999',
                },
            }];

            const controller = new DataController(fakeData);

            const result = await controller.getAllSubmissionsByDate();

            expect(result)
                .to.have.property('label')
                .and.to.be.instanceof(Array);

            expect(result)
                .to.have.property('data')
                .and.to.be.instanceof(Array);
        });
    });
    describe('getAllUsersTypes()', () => {
        it('expect to return an object with two arrays with user types',
            async () => {
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
                typesArray = [
                    'type-1',
                ];

                const controller = new DataController(fakeData);

                const result = await controller.getAllUsersTypes();

                expect(result)
                    .to.have.property('label')
                    .and.to.be.instanceof(Array);

                expect(result)
                    .to.have.property('data')
                    .and.to.be.instanceof(Array);
            });
    });
    describe('getAllUsersCategories()', () => {
        it('expect tp return object with two arrays with user categories',
            async () => {
                userArray = [{
                    id: 1,
                    username: 'koteto99',
                    password: '$2a$10$NAVe/n5c/drosjvnaIZf4.hhrJoekM.Nwbh8/3cXldvH/cxt4GcMa',
                    first_name: 'Malkoto',
                    last_name: 'Kote',
                    email: 'koteto99@hotmail.com',
                    createdAt: '2018 - 04 - 01 T13: 47: 22.000 Z',
                    updatedAt: '2018 - 04 - 01 T13: 47: 22.000 Z',
                }];
                surveysArray = [{
                    user_id: 1,
                    cat_id: 1,
                }];
                categoriesArray = [{
                    id: 1,
                    name: 'Obshtestvenik',
                }];

                const controller = new DataController(fakeData);

                const result = await controller.getAllUsersCategories();

                expect(result)
                .to.have.property('label')
                .and.to.be.instanceof(Array);
                
                expect(result)
                .to.have.property('label')
                .and.to.be.instanceof(Array);
            });
    });
});
