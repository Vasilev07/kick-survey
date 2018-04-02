const Data = require('./data-generic');
const {
    Survey,
    Category,
} = require('../db/models');

class SurveyData extends Data {
    constructor() {
        super(Survey);
    }

    async getUserSurveys(userId, cat = null) {
        if (cat) {
            return this.Model.findAll({
                where: {
                    user_id: userId,
                },
                include: [{
                    model: Category,
                    where: {
                        name: cat,
                    },
                }],
            });
        }

        return this.Model.findAll({
            where: {
                user_id: userId,
            },
            include: [Category],
        });
    }

    getSurvey(userId, surveyName) {
        return this.Model.findOne({
            where: {
                user_id: userId,
                name: surveyName,
            },
            include: [Category],
        });
    }

    deleteSurvey(userId, surveyName) {
        return this.Model.destroy({
            where: {
                user_id: userId,
                name: surveyName,
            },
        });
    }
}

module.exports = {
    SurveyData,
};
