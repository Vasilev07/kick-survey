/* eslint-disable no-invalid-this */

(function () {
    const previews = (function () {
        const _slidersIds = [];
        const _dateTimeIds = [];

        const sliderPreview = function (data, index) {
            const questionWrapper = document.createElement("div");
            const order = document.createElement("span");
            const label = document.createElement("label");
            const slider = document.createElement("div");
            const input = document.createElement("input");

            input.setAttribute("type", "number");
            input.setAttribute("min", "0");
            input.setAttribute("max", "100");
            input.setAttribute("name", "question-" +
                data.questionData.questionId + "-" + data.questionData.type);
            label.setAttribute("for", "input-" + index);

            input.id = "input-" + index;
            slider.id = "slider-" + index;
            questionWrapper.className = "question-wrapper";

            order.innerHTML = index + ". ";
            label.innerHTML = data.questionData.question;

            if (data.questionData.isRequired) {
                input.setAttribute("required", "required");
            }

            questionWrapper.appendChild(order);
            questionWrapper.appendChild(label);
            questionWrapper.appendChild(slider);
            questionWrapper.appendChild(input);

            _slidersIds.push({
                input: "#input-" + index,
                slide: "#slider-" + index
            });

            return questionWrapper;
        };

        const multipleChoicePreview = function (data, index) {
            const questionWrapper = document.createElement("div");
            const order = document.createElement("span");
            const questionLabel = document.createElement("label");

            questionLabel.innerHTML = data.questionData.question;
            order.innerHTML = index + ". ";
            questionWrapper.appendChild(order);
            questionWrapper.appendChild(questionLabel);

            data.answersData.forEach(function (answer) {
                const divCheckBox = document.createElement("div");
                const label = document.createElement("label");
                const input = document.createElement("input");

                divCheckBox.className = "checkbox";
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", answer.answerId);
                input.setAttribute("name", "question-" +
                    data.questionData.questionId + "-" + data.questionData.type);

                label.innerText = answer.answer;

                divCheckBox.appendChild(label);
                label.prepend(input);
                questionWrapper.appendChild(divCheckBox);
            });

            if (data.questionData.isRequired) {
                questionWrapper.className += "required";
            }

            return questionWrapper;
        };

        const singleChoicePreview = function (data, index) {
            const questionWrapper = document.createElement("div");
            const order = document.createElement("span");
            const questionLabel = document.createElement("label");

            questionLabel.innerHTML = data.questionData.question;
            order.innerHTML = index + ". ";
            questionWrapper.appendChild(order);
            questionWrapper.appendChild(questionLabel);

            data.answersData.forEach(function (answer) {
                const divCheckBox = document.createElement("div");
                const label = document.createElement("label");
                const input = document.createElement("input");

                divCheckBox.className = "radio";
                input.setAttribute("type", "radio");
                input.setAttribute("value", answer.answerId);
                input.setAttribute("name", "question-" +
                    data.questionData.questionId + "-" + data.questionData.type);

                input.setAttribute("required", "required");

                label.innerText = answer.answer;

                divCheckBox.appendChild(label);
                label.prepend(input);
                questionWrapper.appendChild(divCheckBox);
            });

            return questionWrapper;
        };

        const singleTextboxPreview = function (data, index) {
            const questionWrapper = document.createElement("div");
            const order = document.createElement("span");
            const questionLabel = document.createElement("label");
            const input = document.createElement("input");

            questionLabel.innerHTML = data.questionData.question;
            order.innerHTML = index + ". ";

            input.setAttribute("type", "text");
            input.setAttribute("name", "question-" +
                data.questionData.questionId + "-" + data.questionData.type);

            if (data.questionData.isRequired) {
                input.setAttribute("required", "required");
            }

            questionWrapper.appendChild(order);
            questionWrapper.appendChild(questionLabel);
            questionWrapper.appendChild(input);

            return questionWrapper;
        };

        const datePreview = function (data, index) {
            const questionWrapper = document.createElement("div");
            const dateWrapper = document.createElement("div");
            const timeWrapper = document.createElement("div");
            const order = document.createElement("span");
            const questionLabel = document.createElement("label");
            const date = document.createElement("input");
            const time = document.createElement("input");
            const dateLabel = document.createElement("label");
            const timeLabel = document.createElement("label");

            date.setAttribute("type", "text");
            date.setAttribute("name", "question-" +
                data.questionData.questionId + "-" + data.questionData.type);
            time.setAttribute("type", "text");
            date.setAttribute("name", "question-" +
                data.questionData.questionId + "-" + data.questionData.type);
            dateLabel.setAttribute("for", "datepicker-" + index);
            timeLabel.setAttribute("for", "timepicker-" + index);

            date.id = "datepicker-" + index;
            time.id = "timepicker-" + index;
            data.className += " datepicker";
            time.className += " timepicker";
            dateWrapper.className = "date-wrapper";
            timeWrapper.className = "time-wrapper";
            questionWrapper.className = "question-wrapper";

            order.innerHTML = index + ". ";
            questionLabel.innerHTML = data.questionData.question;
            dateLabel.innerHTML = "Date: ";
            timeLabel.innerHTML = "Time: ";

            if (data.questionData.isRequired) {
                date.setAttribute("required", "required");
            }

            dateWrapper.appendChild(dateLabel);
            dateWrapper.appendChild(date);
            timeWrapper.appendChild(timeLabel);
            timeWrapper.appendChild(time);
            questionWrapper.appendChild(order);
            questionWrapper.appendChild(questionLabel);
            questionWrapper.appendChild(dateWrapper);
            questionWrapper.appendChild(timeWrapper);

            _dateTimeIds.push({
                dateId: "#datepicker-" + index,
                timeId: "#timepicker-" + index
            });

            return questionWrapper;
        };

        const injectSliders = function (sliders) {
            sliders.forEach((slider) => {
                $(slider.slide).slider({
                    range: "min",
                    animate: "slow",
                    slide: function (event, ui) {
                        $(slider.input).val(ui.value);
                    },
                    change: function (event, ui) {
                        $(slider.input).val(ui.value);
                    }
                });
                $(slider.input).change(function () {
                    $(slider.slide).slider("value", $(this).val());
                });
            });
        };

        const injectDates = function (dateTime) {
            console.log(dateTime);
            dateTime.forEach(function (date) {
                $(date.dateId).datepicker({
                    minDate: new Date()
                });
                $(date.timeId).timepicker({
                    "timeFormat": "H:i:s",
                    "step": 15,
                    "forceRoundTime": true
                });
            });
        };

        const emojisChoicePreview = function (data, index) {
            const questionWrapper = document.createElement("div");

            // questionWrapper.className = "container";

            const question = document.createElement("h4");
            question.innerHTML = index + ". " + data.questionData.question;
            questionWrapper.appendChild(question);

            const label1 = document.createElement("label");
            label1.className = "form-check form-check-inline";
            const input1 = document.createElement("input");
            input1.className = "form-check-input";
            input1.setAttribute("type", "radio");
            input1.setAttribute("name", "question-" + data.questionData.questionId +
                "-" + data.questionData.type);
            input1.setAttribute("value", "smile");
            input1.setAttribute("id", "inlineRadio1");

            const emojiSmile = document.createElement("i");
            emojiSmile.setAttribute("class", "far fa-smile emoji");
            label1.appendChild(input1);
            label1.appendChild(emojiSmile);

            questionWrapper.appendChild(label1);

            const label2 = document.createElement("label");
            label2.className = "form-check form-check-inline";
            const input2 = document.createElement("input");
            input2.className = "form-check-input";
            input2.setAttribute("type", "radio");
            input2.setAttribute("name", "question-" + data.questionData.questionId +
                "-" + data.questionData.type);
            input2.setAttribute("value", "neutral");
            input2.setAttribute("id", "inlineRadio2");

            const emojiMeh = document.createElement("i");
            emojiMeh.setAttribute("class", "far fa-meh emoji");

            label2.appendChild(input2);
            label2.appendChild(emojiMeh);

            questionWrapper.appendChild(label2);

            const label3 = document.createElement("label");
            label3.className = "form-check form-check-inline";
            const input3 = document.createElement("input");
            input3.className = "form-check-input";
            input3.setAttribute("type", "radio");
            input3.setAttribute("name", "question-" + data.questionData.questionId +
                "-" + data.questionData.type);
            input3.setAttribute("value", "sad");
            input3.setAttribute("id", "inlineRadio3");

            const emojiFrown = document.createElement("i");
            emojiFrown.setAttribute("class", "far fa-frown emoji");

            label3.appendChild(input3);
            label3.appendChild(emojiFrown);

            questionWrapper.appendChild(label3);

            return questionWrapper;
        };

        return {
            injectDates,
            injectSliders,
            _dateTimeIds,
            _slidersIds,
            datePreview,
            singleTextboxPreview,
            singleChoicePreview,
            multipleChoicePreview,
            sliderPreview,
            emojisChoicePreview
        };
    })();
    window.previews = previews;
})();
