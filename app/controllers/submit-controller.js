class SubmitController {
    constructor(data) {
        this.data = data;
    }
    /**
     * @description Creates entries in submittedAnswer table for each question
     * in a survey.
     * @description The submit identifier is formed as following:
     * user_id + '&&' + survey_id + '&&' + dd + '/' + mm + '/' + yyyy +
     * ' ' + hour + ':' + minutes + ':' + seconds + ':' + milliseconds;
     * E.g.: 1&&1&&02/03/2018 12:43:05:957
     * @param {Object} submit Object with the data from a submit form
     * @return {Boolean} True or False
     */
    createSubmit(submit) {
        if (submit === null || submit === 'undefined') {
            throw new Error('Invalid object');
        }

        const data = this._beautifyData(submit);
        const currentDate = this._currentDate(new Date());

        const identifier = data.user_id + '&&' +
            data.survey_id + '&&' + currentDate;

        data.questions.map(async (questionInfo) => {
            const createObj = {
                submit_identifier: identifier,
                user_id: +data.user_id,
                survey_id: +data.survey_id,
                question_id: +questionInfo.question_id,
                answer: questionInfo.answer,
                answer_id: questionInfo.answer_id,
            };

            await this.data.submittedAnswer.create(createObj);
        });
        return true;
    }

    async getUserSurveySubmits(id) {
        return await this.data.submittedAnswer.getUserSurveys(id);
    }

    _beautifyData(data) {
        const questions = [];
        data.serialize.forEach((question) => {
            const questionId = question
                .name.match(/\d+/)[0];
            const questionType = question
                .name.replace(/^(?:[^-]*-){1}([^-]*)/, '').slice(1);

            let answerId = null;
            let answer = null;

            if (questionType === 'slider') {
                answerId = null;
                answer = question.value;
            } else if (questionType === 'single-textbox') {
                answerId = null;
                answer = question.value;
            } else if (questionType === 'multiple-choice') {
                answerId = question.value;
                answer = null;
            } else if (questionType === 'single-choice') {
                answerId = question.value;
                answer = null;
            } else if (questionType === 'emojis') {
                answerId = null;
                answer = question.value;
            } else if (questionType === 'date') {
                answerId = null;
                answer = question.value;
            }

            questions.push({
                question_id: questionId,
                questionType,
                answer,
                answer_id: answerId,
            });
        });

        const object = {
            questions,
            survey_id: data.surveyDataObj.surveyId,
            name: data.surveyDataObj.name,
            user_id: data.surveyDataObj.userId,
        };

        return object;
    }

    _currentDate(today) {
        const dd = (today.getDate() < 10 ? '0' : '') + today.getDate();
        const mm = (today.getMonth() + 1 < 10 ? '0' : '') +
            (today.getMonth() + 1);
        const yyyy = today.getFullYear();
        const hour = (today.getHours() < 10 ? '0' : '') +
            today.getHours();
        const minutes = (today.getMinutes() < 10 ? '0' : '') +
            today.getMinutes();
        const seconds = (today.getSeconds() < 10 ? '0' : '') +
            today.getSeconds();
        const milliseconds = today.getMilliseconds();

        return dd + '/' + mm + '/' + yyyy + ' ' + hour + ':' +
            minutes + ':' + seconds + ':' + milliseconds;
    }
}

module.exports = SubmitController;
