const Crypto = require('./cryptography-controller');

class SubmitController {
    constructor(data) {
        this.data = data;
    }
    createSubmit(submit) {
        const data = this._beautifyData(submit);
        console.log('-'.repeat(10));
        console.log(data);
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
                questionId,
                questionType,
                answer,
                answerId,
            });
        });

        const object = {
            questions,
            surveyId: data.surveyDataObj.surveyId,
            name: data.surveyDataObj.name,
            userId: data.surveyDataObj.userId,
        };

        return object;
    }
}

module.exports = SubmitController;
