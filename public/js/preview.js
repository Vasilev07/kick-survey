/* eslint-global previews */

$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);
    let surveyData;
    $.ajax({
        method: "GET",
        async: true,
        url: "/api/" + url,
        beforeSend: function () {
            $(".spinner").show();
            $(".over").show();
        },
        error: function (error) {
            $(".spinner").hide();
            $(".over").hide();

            const body = $("body");
            const errorElement = document.createElement("h1");
            body.append(errorElement);
            $(errorElement).html(error.responseJSON.message)
                .css("text-align", "center");
        },
        success: function (survey) {
            setTimeout(function () {
                $(".spinner").hide();
                $(".over").hide();
            }, 600);

            surveyData = survey;
            const surveyWrapper = $("<div></div>");
            const questionWrapper = $("<div></div>");
            const thumbnailWrapper = $("<div></div>");
            const captionWrapper = $("<div></div>");
            const titleDiv = $("<div></div>");
            const catDiv = $("<div></div>");
            const dateDiv = $("<div></div>");
            const titleWrapper = $("<div></div>");

            surveyWrapper.addClass("col-xs-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 survey");
            thumbnailWrapper.addClass("thumbnail");
            captionWrapper.addClass("caption");

            titleDiv.addClass("survey-title col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4")
                .append($("<i></i>")
                    .addClass("fas fa-heading")
                    .tooltip({
                        title: "Survey title"
                    }))
                .append($("<span></span>")
                    .html(survey.name));

            catDiv.addClass("survey-cat col-xs-4 col-sm-4 col-md-4 col-lg-3 col-xl-4")
                .append($("<i></i>")
                    .addClass("fas fa-folder")
                    .tooltip({
                        title: "Category"
                    }))
                .append($("<span></span>")
                    .html(survey.Category.name));

            dateDiv.addClass("survey-date col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4")
                .append($("<i></i>")
                    .addClass("fas fa-calendar-alt")
                    .tooltip({
                        title: "Creation date"
                    }))
                .append($("<span></span>")
                    .html((survey.createdAt)
                        .replace("T", "")
                        .replace("Z", "")
                        .slice(0, 10)));

            titleWrapper.addClass("row")
                .append(titleDiv)
                .append(catDiv)
                .append(dateDiv)

            captionWrapper
                .append(titleWrapper)
                .append("<hr>");

            const form = $("#submit-survey");

            $("#main").append(surveyWrapper);
            survey.surveyContentData.forEach(function (element, index) {
                const row = $("<div></div>");
                const formGroup = $("<div></div>");
                row.addClass("row");
                formGroup.addClass("form-group");

                let newElement;
                row.append(formGroup);
                if (element.questionData.type === "slider") {
                    newElement = window.previews.sliderPreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionData.type === "multiple-choice") {
                    newElement = window.previews.multipleChoicePreview(element, index + 1);
                    formGroup.className += " checkbox-group";
                    formGroup.append(newElement);
                } else if (element.questionData.type === "single-choice") {
                    newElement = window.previews.singleChoicePreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionData.type === "single-textbox") {
                    newElement = window.previews.singleTextboxPreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionData.type === "emojis") {
                    newElement = window.previews.emojisChoicePreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionData.type === "date") {
                    newElement = window.previews.datePreview(element, index + 1);
                    formGroup.append(newElement);
                }
                row.append("<hr>");
                form.append(row);
            });

            window.previews.injectSliders(window.previews._slidersIds);
            window.previews.injectDates(window.previews._dateTimeIds);

            captionWrapper.append(form).addClass("info");

            const submitBtn = $("<button></button>");

            submitBtn.attr("id", "submit-survey-btn");
            submitBtn.addClass("btn btn-success");
            submitBtn.attr("type", "submit");
            submitBtn.attr("value", "Submit");
            submitBtn.html("Submit");
            form.append(submitBtn);
            surveyWrapper.append(thumbnailWrapper.append(captionWrapper));
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
        const submissionModal = $("#submission-survey-modal");
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
                submissionModal
                    .find(".modal-body")
                    .append($("<span></span>")
                        .html("Unfortunately, we couldn't save your submission."));
                submissionModal
                    .find("#submit-survey-modal-label")
                    .append($("<i></i>")
                        .addClass("fas fa-times-circle")
                        .css("color", "#ce0101")
                    );
                submissionModal.modal("show");
            },
            success: function (resolve) {
                submissionModal
                    .find(".modal-body")
                    .append($("<span></span>")
                        .html("Thank you for your submission."));
                submissionModal
                    .find("#submit-survey-modal-label")
                    .append($("<i></i>")
                        .addClass("fas fa-check-circle")
                        .css("color", "#0EB511")
                    );
                submissionModal.modal("show");
            }
        });

        return false;
    });
});