class DataController {
    constructor(data) {
        this.data = data;
    }
/**
 * @description Iterates through the user's object and
 * retrieves his surveys, the surveys' questions and answers
 * @param {Object} user
 * @async
 * @return {Promise<Object>} The collected data
 */
    async getSurveysData(user) {
        const surveys = await this.data.surveys.getUserSurveys(user.id);

        const surveysResults = surveys.map(async (survey) => {
            const surveyData = {
                surveyData: {
                    id: survey.id,
                    name: survey.name,
                    category: survey.Category.name,
                    createdAt: survey.createdAt,
                },
                surveyContentData: [],
            };

            const questions =
                await this.data.questions.getSurveyQuestions(survey.id);

            const questionsResults = questions.map(async (question) => {
                const questionDataObj = {
                    questionData: {
                        question: question.name,
                        order: question.order,
                        isRequired: question.is_required,
                        type: question.Type.q_type,
                    },
                    answersData: [],
                };

                const answers =
                    await this.data.answers.getQuestionAnswers(question.id);

                const answersResults = answers.map((answer) => {
                    return {
                        answer: answer.answer_name,
                    };
                });

                questionDataObj.answersData.push(...answersResults);
                return questionDataObj;
            });

            const resultQ = await Promise.all(questionsResults);
            surveyData.surveyContentData.push(...resultQ);
            return surveyData;
        });

        const surveysData = await Promise.all(surveysResults);

        return surveysData;
    }
}

module.exports = DataController;
