class DataController {
    constructor(data) {
        this.data = data;
    }

    getByUser(user) {
        const output = [];
        this.data.surveys.getUserSurveys(user.id).then((surveys) => {
            surveys.map(async (survey) => {
                const surveyData = {
                    survey: {
                        id: survey.id,
                        name: survey.name,
                        category: survey.Category.name,
                        createdAt: survey.createdAt,
                    },
                    questionsAnswers: [],
                };
                const questions = await this.data.questions.getSurveyQuestions(survey.id);
                questions.map(async (question) => {
                    const questionsAnswersObj = {
                        question: {
                            id: question.id,
                            order: question.order,
                            name: question.name,
                            isRequired: question.is_Required,
                            type: question.Type.q_type,
                        },
                        answers: [],
                    };
                    const answers = await this.data.answers.getQuestionAnswers(question.id);
                    answers.map(async (answer) => {
                        questionsAnswersObj.answers.push({
                            id: answer.id,
                            name: answer.answer_name,
                        });
                    });
                    surveyData.questionsAnswers.push(questionsAnswersObj);
                });
                output.push(surveyData);
            });
        });
        return output;
    }
}

module.exports = DataController;
