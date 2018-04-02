const {
    Type,
    Category,
} = require('../db/models');

const Data = require('./data-generic');

const {
    UsersData,
} = require('./users-data');
const {
    SurveyData,
} = require('./survey-data');
const {
    QuestionData,
} = require('./question-data');
const {
    AnswerData,
} = require('./answer-data');
const {
    SubmittedAnswerData,
} = require('./submittedAnswer-data');
const {
    CategoryData,
} = require('./category-data');
const {
    TypeData,
} = require('./type-data');

module.exports = {
    users: new UsersData(),
    questions: new QuestionData(),
    surveys: new SurveyData(),
    types: new TypeData(),
    categories: new CategoryData(),
    answers: new AnswerData(),
    submittedAnswer: new SubmittedAnswerData(),
};
