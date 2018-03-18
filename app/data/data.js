const {
    User,
    Question,
    Survey,
    Type,
    Category,
    Answer,
} = require('../db/models');

const Data = require('./data-generic');

module.exports = {
    users: new Data(User),
    questions: new Data(Question),
    surveys: new Data(Survey),
    types: new Data(Type),
    categories: new Data(Category),
    answers: new Data(Answer),
};
