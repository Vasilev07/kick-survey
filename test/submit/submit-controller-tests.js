const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const SubmitController = require('../../app/controllers/submit-controller');

let submittedAnswerArray = [];

const fakeData = {
    submittedAnswer: {
        getUserSurveys(id) {
            const found =
                submittedAnswerArray.find((survey) => survey.user_id === id);
            if (!found) {
                return [];
            }
            return found;
        },
        getAll() {
            return submittedAnswerArray;
        },
        getById(id) {
            return submittedAnswerArray.find((survey) => survey.id === id);
        },
        create(user) {
            return user;
        },
    },
};

describe('SubmitController', () => {
    describe('createSubmit', () => {
        describe('when data is valid', () => {
            it('expect to return true', async () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-single-choice',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller.createSubmit(obj);

                return expect(returnedData).to.be.true;
            });
        });
        describe('when object is invalid', () => {
            it('expect to throw error', async () => {
                const obj = null;

                const controller = new SubmitController(fakeData);

                const func = () => {
                    const returnedData = controller.createSubmit(obj);
                    return returnedData;
                };

                return expect(func).to.throw('Invalid object');
            });
        });
    });
    describe('_beautifyData', () => {
        describe('when the question type is single-choice', () => {
            it('expect to return a valid object', () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-single-choice',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'Some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller._beautifyData(obj);

                expect(typeof returnedData).to.equals('object');
            });
        });
        describe('when the question type is multiple-choice', () => {
            it('expect to return a valid object', () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-multiple-choice',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'Some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller._beautifyData(obj);

                expect(typeof returnedData).to.equals('object');
            });
        });
        describe('when the question type is emojis', () => {
            it('expect to return a valid object', () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-emojis',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'Some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller._beautifyData(obj);

                expect(typeof returnedData).to.equals('object');
            });
        });
        describe('when the question type is single-textbox', () => {
            it('expect to return a valid object', () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-single-textbox',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'Some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller._beautifyData(obj);

                expect(typeof returnedData).to.equals('object');
            });
        });
        describe('when the question type is slider', () => {
            it('expect to return a valid object', () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-slider',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'Some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller._beautifyData(obj);

                expect(typeof returnedData).to.equals('object');
            });
        });
        describe('when the question type is date', () => {
            it('expect to return a valid object', () => {
                const obj = {
                    serialize: [{
                        name: 'question-1-date',
                        value: '1',
                    }],
                    surveyDataObj: {
                        surveyId: '1',
                        name: 'Some name',
                        userId: '1',
                    },
                };

                const controller = new SubmitController(fakeData);

                const returnedData = controller._beautifyData(obj);

                return expect(typeof returnedData).to.equals('object');
            });
        });
    });
    describe('getUserSurveySubmits', () => {
        describe('when data is valid', () => {
            it('expect to return the found objects', async () => {
                submittedAnswerArray = [{
                    user_id: 1,
                }];

                const controller = new SubmitController(fakeData);

                const data = await controller.getUserSurveySubmits(1);

                return expect(data.user_id).to.be.equal(1);
            });
        });
        describe('when data is invalid', () => {
            it('expect to return empty array', async () => {
                submittedAnswerArray = [{
                    user_id: 1,
                }];

                const controller = new SubmitController(fakeData);

                const data = await controller.getUserSurveySubmits(2);

                return expect(data).to.be.deep.equal([]);
            });
        });
    });
});
