const Data = require('./data-generic');
const {
    Survey,
    Category,
} = require('../db/models');

class SurveyData extends Data {
    constructor() {
        super(Survey);
    }

    async getUserSurveys(userId) {
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
}

module.exports = {
    SurveyData,
};

// const cont = new SurveyData();
// const run = async () => {
//     const res = await cont.getSurvey(1, 'Obshtestvenik');
//     console.log(res.Category);
// };
// run();
