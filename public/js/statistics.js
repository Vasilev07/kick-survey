$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);

    const surveyInfo = function (survey) {
        const infoWrapper = $("<div></div>");
        const thumbnailWrapper = $("<div></div>");
        const thumbnail = $("<div></div>");
        const caption = $("<div></div>");
        const questionNameDiv = $("<div></div>");
        const typeOfAnswer = $("<div></div>");

        const responsesDiv = $("<div></div>");
        const dateDiv = $("<div></div>");
        const totalDiv = $("<div></div>");

        infoWrapper.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6");
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



        caption
            .append(questionNameDiv)
            .append("<hr>")
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
        infoWrapper.append(thumbnailWrapper.append(caption));

        return infoWrapper;
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
            survey.surveyContentData.forEach((survey) => {
                const newRow = surveyInfo(survey);
                $("#main").append($(newRow));
            });
        }
    });
});