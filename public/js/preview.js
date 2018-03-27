const previews = (function () {
    const _slidersIds = [];
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
    }


    const emojisChoicePreview = function (data, index) {
        const questionWrapper = document.createElement("div");
        // questionWrapper.className = "container";

        const question = document.createElement("h4"); 
        question.innerHTML = index +'. ' +  data.questionData.question;
        questionWrapper.appendChild(question);

        const label1 = document.createElement("label");
        label1.className = "form-check form-check-inline";
        const input1 = document.createElement("input");
        input1.className = "form-check-input";
        input1.setAttribute("type", "radio");
        input1.setAttribute("name", "inlineRadioOptions");
        input1.setAttribute("value", "option1");
        input1.setAttribute("id", "inlineRadio1");
        input1.setAttribute("value", "option1");

        const emojSmile = document.createElement("i");
        emojSmile.setAttribute("class", "far fa-smile");
        label1.appendChild(input1);
        label1.appendChild(emojSmile);

        questionWrapper.appendChild(label1);

        const label2 = document.createElement("label");
        label2.className = "form-check form-check-inline";
        const input2 = document.createElement("input");
        input2.className = "form-check-input";
        input2.setAttribute("type", "radio");
        input2.setAttribute("name", "inlineRadioOptions");
        input2.setAttribute("value", "option2");
        input2.setAttribute("id", "inlineRadio2");
        input2.setAttribute("value", "option2");
       
        const emojMeh = document.createElement("i");
        emojMeh.setAttribute("class","far fa-meh");
       
        label2.appendChild(input2);
        label2.appendChild(emojMeh);

        questionWrapper.appendChild(label2);

        const label3 = document.createElement("label");
        label3.className = "form-check form-check-inline";
        const input3 = document.createElement("input");
        input3.className = "form-check-input";
        input3.setAttribute("type", "radio");
        input3.setAttribute("name", "inlineRadioOptions");
        input3.setAttribute("value", "option3");
        input3.setAttribute("id", "inlineRadio3");
        input3.setAttribute("value", "option3");

        const emojFrown = document.createElement("i");
        emojFrown.setAttribute("class", "far fa-frown");
       
        label3.appendChild(input3);
        label3.appendChild(emojFrown);

        questionWrapper.appendChild(label3);

        

        return questionWrapper;
    };

    return {
        injectSliders,
        _slidersIds,
        singleTextboxPreview,
        singleChoicePreview,
        multipleChoicePreview,
        sliderPreview,
        emojisChoicePreview,
    };
})();

$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);
    let surveyData;
    $.ajax({
        method: "GET",
        async: true,
        url: "/api/" + url,
        error: function (error) {
            console.log(error);
        },
        success: function (survey) {
            surveyData = survey;
            console.log(survey);
            $(".survey-name p span").text(survey.name);
            $(".survey-category p span").text(survey.Category.name);
            $(".created-date p span").text(survey.createdAt);
            const form = document.getElementById("submit-survey");

            survey.surveyContentData.forEach(function (element, index) {
                const row = document.createElement("div");
                const formGroup = document.createElement("div");

                row.className = "row";
                formGroup.className = "form-group";

                let newElement;
                row.appendChild(formGroup);
                if (element.questionData.type === "slider") {
                    newElement = previews.sliderPreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "multiple-choice") {
                    newElement = previews.multipleChoicePreview(element, index + 1);
                    formGroup.className += " checkbox-group";
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "single-choice") {
                    newElement = previews.singleChoicePreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "single-textbox") {
                    newElement = previews.singleTextboxPreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "emojis") {
                    newElement = previews.emojisChoicePreview(element, index + 1);
                    formGroup.appendChild(newElement);                    
                }
                form.appendChild(row);
            });

            previews.injectSliders(previews._slidersIds);

            const submitBtn = document.createElement("button");
            submitBtn.id = "submit-survey-btn";
            submitBtn.className = "btn btn-success";
            submitBtn.setAttribute("type", "submit");
            submitBtn.setAttribute("value", "Submit");
            submitBtn.innerHTML = "Submit";
            form.appendChild(submitBtn);
        }
    });

    const validateCheckbox = function (requiredCheckbox) {
        let flag = true;
        requiredCheckbox.each(function (index, checkbox) {
            const selected = $(checkbox).children(".checkbox").find("input:checked");
            if (selected.length === 0) {
                flag = false;
            }
        });
        return flag;
    };

    $("#submit-survey").submit(function (e) {
        e.preventDefault();
        const requiredCheckbox = $(".checkbox-group .required");
        const validate = validateCheckbox(requiredCheckbox);
        if (!validate) {
            console.log("error!");
            return false;
        }

        const serialize = $("#submit-survey").serializeArray();

        const surveyDataObj = {
            surveyId: surveyData.id,
            name: surveyData.name,
            userId: surveyData.user_id
        };

        $.ajax({
            method: "POST",
            async: true,
            url: "/submit",
            data: {
                serialize,
                surveyDataObj
            },
            error: function (error) {
                console.log(error);
            },
            success: function (resolve) {
                console.log(resolve);
            }
        });

        return false;
    });
});