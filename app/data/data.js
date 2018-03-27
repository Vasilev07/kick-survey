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

module.exports = {
    users: new UsersData(),
    questions: new QuestionData(),
    surveys: new SurveyData(),
    types: new Data(Type),
    categories: new Data(Category),
    answers: new AnswerData(),
    submittedAnswer: new SubmittedAnswerData(),
};
