/* eslint-global previews */
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
                    newElement = window.previews.sliderPreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "multiple-choice") {
                    newElement = window.previews.multipleChoicePreview(element, index + 1);
                    formGroup.className += " checkbox-group";
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "single-choice") {
                    newElement = window.previews.singleChoicePreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "single-textbox") {
                    newElement = window.previews.singleTextboxPreview(element, index + 1);
                    formGroup.appendChild(newElement);
                } else if (element.questionData.type === "emojis") {
                    newElement = window.previews.emojisChoicePreview(element, index + 1);
                    formGroup.appendChild(newElement);
                }
                form.appendChild(row);
            });

            window.previews.injectSliders(window.previews._slidersIds);

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
                console.log("Success");
            }
        });

        return false;
    });
});
