чconst {
    Category,
    Type,
    User,
    Question,
    Answer,
    Survey,
} = require('../db/models');

const {
    data,
} = require('./predefined');

const deleteAll = async () => {
    await Type.destroy({
        where: {},
    });
    await Category.destroy({
        where: {},
    });
    await User.destroy({
        where: {},
    });
    await Survey.destroy({
        where: {},
    });
    await Question.destroy({
        where: {},
    });
};
const populateData = async () => {
    await deleteAll();

    const user = {
        username: 'koteto99',
        password: '$2a$10$NAVe/n5c/drosjvnaIZf4.hhrJoekM.Nwbh8/3cXldvH/cxt4GcMa',
        first_name: 'Malkoto',
        last_name: 'Kote',
        email: 'koteto99@hotmail.com',
    };
    const userSurvey1 = {
        name: 'Obshtestvenik',
        cat_id: 2,
    };
    const userSurvey2 = {
        name: 'Za kolegite',
        cat_id: 3,
    };
    const question1 = {
        order: 1,
        name: 'Shte vali li dnes',
        is_required: 1,
        type_id: 3,
    };
    const question2 = {
        order: 2,
        name: 'A utre shte vali li?',
        is_required: 1,
        type_id: 4,
    };
    const question3 = {
        order: 3,
        name: 'Kak si dnes',
        is_required: 1,
        type_id: 3,
    };
    const question4 = {
        order: 4,
        name: 'Kak si dnes be, mladej?',
        is_required: 1,
        type_id: 2,
    };
    const question5 = {
        order: 5,
        name: 'Are you happy with our services?',
        is_required: 0,
        type_id: 6,
    };
    const question6 = {
        order: 6,
        name: 'Koga si svoboden be?',
        is_required: 1,
        type_id: 6,
    };

    const answer11 = {
        answer_name: 'Da, shte vali dnes',
    };
    const answer12 = {
        answer_name: 'Ne, nqma da vali dnes',
    };
    const answer21 = {
        answer_name: 'Da, shte vali utre',
    };
    const answer22 = {
        answer_name: 'Ne, nqma da vali utre',
    };
    const answer31 = {
        answer_name: '20',
    };
    const answer41 = {
        answer_name: '',
    };
    const answer51 = {
        answer_name: '',
    };
    const answer61 = {
        answer_name: '',
    };

    data.types.map(async (type) => {
        await Type.create(type);
    });
    data.categories.map(async (category) => {
        await Category.create(category);
    });
    const userModel = await User.create(user);

    const userSurvey1Model = await Survey.create(userSurvey1);
    const userSurvey2Model = await Survey.create(userSurvey2);

    userSurvey1Model.setUser(userModel);
    userSurvey2Model.setUser(userModel);

    const surveyQ1Model = await Question.create(question1);
    const surveyQ2Model = await Question.create(question2);
    const surveyQ3Model = await Question.create(question3);
    const surveyQ4Model = await Question.create(question4);
    const surveyQ5Model = await Question.create(question5);
    const surveyQ6Model = await Question.create(question6);

    surveyQ1Model.setSurvey(userSurvey1Model);
    surveyQ2Model.setSurvey(userSurvey1Model);
    surveyQ3Model.setSurvey(userSurvey1Model);
    surveyQ4Model.setSurvey(userSurvey1Model);
    surveyQ5Model.setSurvey(userSurvey1Model);
    surveyQ6Model.setSurvey(userSurvey1Model);

    const surveyA11Model = await Answer.create(answer11);
    const surveyA12Model = await Answer.create(answer12);
    const surveyA21Model = await Answer.create(answer21);
    const surveyA22Model = await Answer.create(answer22);
    const surveyA31Model = await Answer.create(answer31);
    const surveyA41Model = await Answer.create(answer41);
    const surveyA51Model = await Answer.create(answer51);
    const surveyA61Model = await Answer.create(answer61);

    surveyA11Model.setQuestion(surveyQ1Model);
    surveyA12Model.setQuestion(surveyQ1Model);
    surveyA21Model.setQuestion(surveyQ2Model);
    surveyA22Model.setQuestion(surveyQ2Model);
    surveyA31Model.setQuestion(surveyQ3Model);
    surveyA41Model.setQuestion(surveyQ4Model);
    surveyA51Model.setQuestion(surveyQ5Model);
    surveyA61Model.setQuestion(surveyQ6Model);
};

populateData().then(() => {
    const getAll = async () => {
        return await Survey.findAll({
            include: [{
                model: User,
                where: {
                    id: 1,
                },
            }],
        });
    };

    getAll().then((res) => {
        res.map(async (survey) => {
            const surId = survey.id;

            const q = await Question.findAll({
                include: [{
                    model: Survey,
                    where: {
                        id: surId,
                    },
                }],
            });

            q.map(async (question) => {
                const qId = question.id;
                const a = await Answer.findAll({
                    where: {
                        q_id: qId,
                    },
                    include: [{
                        model: Question,
                    }],
                });
                console.log('-'.repeat(15));
                console.log('Survey name: ' + survey.name);
                console.log('-'.repeat(15));
                console.log('\tQuestion: ' + question.name);
                a.map((answer) => {
                    console.log('\t\tAnswer: ' + answer.answer_name);
                });
            });
        });
    });
});
