/* eslint-disable */
var previews = (function () {
    var _slidersIds = [];
    var sliderPreview = function (data, index) {
        var questionWrapper = document.createElement("div");
        var order = document.createElement("span");
        var label = document.createElement("label");
        var slider = document.createElement("div");
        var input = document.createElement("input");

        input.setAttribute('type', 'number');
        input.setAttribute("min", "0");
        input.setAttribute("max", "100");
        input.setAttribute("name", data.questionData.question)
        label.setAttribute('for', "input-" + index);

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
            slide: "#slider-" + index,
        });

        return questionWrapper;
    }

    var multipleChoicePreview = function (data, index) {
        var questionWrapper = document.createElement("div");
        var order = document.createElement("span");
        var questionLabel = document.createElement("label");

        questionLabel.innerHTML = data.questionData.question;
        order.innerHTML = index + ". ";
        questionWrapper.appendChild(order);
        questionWrapper.appendChild(questionLabel);

        data.answersData.forEach(function (answer) {
            var divCheckBox = document.createElement("div");
            var label = document.createElement("label");
            var input = document.createElement("input");

            if(data.questionData.isRequired) {
                input.setAttribute("required", "required");
            }

            divCheckBox.className = "checkbox";
            input.setAttribute("type", "checkbox");
            input.setAttribute("value", answer.answer);
            input.setAttribute("name", data.questionData.question)

            label.innerText = answer.answer;

            divCheckBox.appendChild(label);
            label.prepend(input);
            questionWrapper.appendChild(divCheckBox);
        });

        return questionWrapper;
    }

    var singleChoicePreview = function (data, index) {
        var questionWrapper = document.createElement("div");
        var order = document.createElement("span");
        var questionLabel = document.createElement("label");

        questionLabel.innerHTML = data.questionData.question;
        order.innerHTML = index + ". ";
        questionWrapper.appendChild(order);
        questionWrapper.appendChild(questionLabel);

        data.answersData.forEach(function (answer) {
            var divCheckBox = document.createElement("div");
            var label = document.createElement("label");
            var input = document.createElement("input");

            divCheckBox.className = "radio";
            input.setAttribute("type", "radio");
            input.setAttribute("value", answer.answer);
            input.setAttribute("name", data.questionData.question);
            
            input.setAttribute("required", "required");

            label.innerText = answer.answer;

            divCheckBox.appendChild(label);
            label.prepend(input);
            questionWrapper.appendChild(divCheckBox);
        });

        return questionWrapper;
    };

    var singleTextboxPreview = function (data, index) {
        var questionWrapper = document.createElement("div");
        var order = document.createElement("span");
        var questionLabel = document.createElement("label");
        var input = document.createElement("input");

        questionLabel.innerHTML = data.questionData.question;
        order.innerHTML = index + ". ";

        input.setAttribute("type", "text");
        input.setAttribute("name", data.questionData.question);

        if(data.questionData.isRequired) {
            input.setAttribute("required", "required");
        }

        questionWrapper.appendChild(order);
        questionWrapper.appendChild(questionLabel);
        questionWrapper.appendChild(input);

        return questionWrapper;
    }

    var injectSliders = function (sliders) {
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

        })
    };

    return {
        injectSliders,
        _slidersIds,
        singleTextboxPreview,
        singleChoicePreview,
        multipleChoicePreview,
        sliderPreview,
    }
})();

$(function () {
    var url = window.location.href.match(/[0-9a-zA-Z]+$/);
    
    $.ajax({
        method: 'GET',
        async: true,
        url: '/api/' + url,
        error: function (error) {
            console.log(error);
        },
        success: function (survey) {
            console.log(survey)
            $('.survey-name p span').text(survey.name);
            $('.survey-category p span').text(survey.Category.name);
            $('.created-date p span').text(survey.createdAt);
            var form = document.getElementById("submit-survey")
            survey.surveyContentData.forEach(function (element, index) {
                var row = document.createElement("div");
                var formGroup = document.createElement("div");

                row.className = "row";
                formGroup.className = "form-group"

                var newElement;
                row.appendChild(formGroup);
                if (element.questionData.type === 'slider') {
                    newElement = previews.sliderPreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === 'multiple-choice') {
                    newElement = previews.multipleChoicePreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === 'single-choice') {
                    newElement = previews.singleChoicePreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === 'single-textbox') {
                    newElement = previews.singleTextboxPreview(element, index + 1);
                    formGroup.appendChild(newElement);
                }

                form.appendChild(row);

            });

            previews.injectSliders(previews._slidersIds);

            var submitBtn = document.createElement("button");
            submitBtn.id = "submit-survey-btn";
            submitBtn.className = "btn btn-success";
            submitBtn.setAttribute("type", "submit");
            submitBtn.setAttribute("value", "Submit");
            submitBtn.innerHTML = "Submit";
            form.appendChild(submitBtn);
        }
    });

    $("#submit-survey-btn").click(function (e) {

    })
});

/* eslint-enable */
