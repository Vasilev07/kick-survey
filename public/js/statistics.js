$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);

    const surveyInfo = function (survey, index, surveyName) {
        const panel = $("<div></div>");
        const panelHeading = $("<div></div>");
        const panelTitle = $("<h4></h4>");
        const accordionButton = $("<a></a>");
        const collapseDiv = $("<div></div>");
        const panelBody = $("<div></div>");

        const infoWrapper = $("<div></div>");
        const thumbnailWrapper = $("<div></div>");
        const thumbnail = $("<div></div>");
        const caption = $("<div></div>");
        const questionNameDiv = $("<div></div>");
        const typeOfAnswer = $("<div></div>");

        const responsesDiv = $("<div></div>");
        const dateDiv = $("<div></div>");
        const totalDiv = $("<div></div>");

        panel.addClass("panel panel-default");
        panelHeading.addClass("panel-heading").attr({
            role: "tab",
            id: surveyName,
        });
        panelTitle.addClass("panel-title");
        accordionButton.attr({
            role: "button",
            "data-toggle": "collapse",
            "data-parent": "#accordion",
            href: "#collapse" + index,
            "aria-expanded": "true",
            "aria-controls": "collapse" + index
        });
        collapseDiv.attr({
            id: "collapse" + index,
            class: "panel-collapse collapse in",
            role: "tabpanel",
            "aria-labelledby": "Heading" + index
        });
        panelBody.addClass("panel-body");

        infoWrapper.addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12");
        thumbnailWrapper.addClass("thumbnail");
        caption.addClass("caption");

        questionNameDiv.addClass("survey-question row")
            .append($("<i></i>")
                .addClass("fas fa-question-circle")
                .tooltip({
                    title: "Question name"
                }))
            .append($("<span></span>")
                .addClass("info bolded")
                .append(survey.questionData.questionId)
                .append(". ")
                .append(survey.questionData.question));

        typeOfAnswer.addClass("survey-question row")
            .append($("<i></i>")
                .addClass("fa fa-arrow-circle-down")
                .tooltip({
                    title: "Type answers"
                }))
            .append($("<span></span>")
                .addClass("info")
                .append(survey.questionData.type));

        panelTitle.append(questionNameDiv);

        caption
            .append(typeOfAnswer)
            .append("<hr>")


        Object.keys(survey.answerCount).forEach((answer) => {
            const answerChoices = $("<div></div>");
            answerChoices.addClass("survey-question row answer")
                .append($("<i></i>")
                    .addClass("fa fa-arrow-circle-right")
                    .tooltip({
                        title: "Type answers"
                    }))
                .append($("<span></span>")
                    .addClass("info")
                    .append(answer))
                .append($("<span></span>")
                    .addClass("info")
                    .addClass("badge")
                    .tooltip({
                        title: "People answered with this option"
                    })
                    .append(survey.answerCount[answer]));
            caption.append(answerChoices).append("<hr>");
        });

        dateDiv.addClass("survey-date row")
            .append($("<i></i>")
                .addClass("fas fa-calendar-alt")
                .tooltip({
                    title: "Creation date"
                }))
            .append($("<span></span>")
                .addClass("info")
                .html((window.my_own_attr)
                    .replace("T", " ")
                    .replace("Z", " ")
                    .slice(0, -5)));

        caption
            .append(dateDiv)
            .append("<hr>");

        panel
            .append(panelHeading
                .append(panelTitle
                    .append(accordionButton
                        .append(collapseDiv
                            .append(panelBody
                                .append(infoWrapper
                                    .append(thumbnailWrapper
                                        .append(caption))))))));

        return panel;
    }
    $.ajax({
        method: "GET",
        async: true,
        url: "/api/analyze/" + url,
        beforeSend: function () {

            // something to confuse the user here
        },
        error: function (error) {
            console.log(error);
        },
        success: function (survey) {
            console.log(survey);
            // console.log(survey.surveyContentData);
            const surveysHeader = $("#main");
            window.my_own_attr = survey.Category.createdAt;
            const surveyName = survey.name;
            survey.surveyContentData.forEach((survey, index) => {
                const newRow = surveyInfo(survey, index, surveyName);
                $("#main").append($(newRow));
            });
        }
    });
});