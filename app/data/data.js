const {
    User,
    Survey,
    Question,
    Type,
    Category,
    Answer,
} = require('../db/models');

const Data = require('./data-generic');

const UsersData = require('./users-data');
const SurveyData = require('./survey-data');
const QuestionData = require('./question-data');
const AnswerData = require('./answer-data');

module.exports = {
    users: new UsersData(User),
    questions: new QuestionData(Question),
    surveys: new SurveyData(Survey),
    types: new Data(Type),
    categories: new Data(Category),
    answers: new AnswerData(Answer),
};
