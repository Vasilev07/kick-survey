const {
    User,
    Question,
    Survey,
    Type,
    Category,
    Answer,
} = require('../db/models');

const Data = require('./data-generic');
const {
    UsersData,
} = require('./users-data');

module.exports = {
    users: new UsersData(),
    questions: new Data(Question),
    surveys: new Data(Survey),
    types: new Data(Type),
    categories: new Data(Category),
    answers: new Data(Answer),
    
};
