$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);
    
    const surveyInfo = function (survey, index, surveyName) {
        const panel = $("<div></div>");
        const anchorHead = $("<div></div>");
        const collapseDiv = $("<div></div>");
        const panelBody = $("<div></div>");
        const panelHeading = $("<div></div>");
        const infoWrapper = $("<div></div>");
        const thumbnailWrapper = $("<div></div>");
        const caption = $("<div></div>");
        const typeOfAnswer = $("<div></div>");
        const dateDiv = $("<div></div>");

        panel.addClass("panel panel-success");
        collapseDiv.addClass("collapse")
            .attr("id", "collapse-" + index);
        panelHeading.addClass("panel-heading");
        panelBody.addClass("panel-body");
        infoWrapper.addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12");
        thumbnailWrapper.addClass("thumbnail");
        caption.addClass("caption").append(typeOfAnswer);

        anchorHead.addClass("survey-question row")
            .attr({
                role: "button",
                "data-toggle": "collapse",
                href: "#collapse-" + index,
                "aria-expanded": "false",
                "area-controls": "collapse-" + index
            })
            .append($("<i></i>")
                .addClass("fas fa-question-circle")
                .tooltip({
                    title: "Question name"
                }))
            .append($("<span></span>")
                .addClass("info bolded")
                .append(index + 1)
                .append(". ")
                .append(survey.questionData.question));

        panelHeading.append(anchorHead);

        typeOfAnswer.addClass("survey-question row")
            .append($("<i></i>")
                .addClass("fa fa-arrow-circle-down")
                .tooltip({
                    title: "Type answers"
                }))
            .append($("<span></span>")
                .addClass("info")
                .append(survey.questionData.type));

        Object.keys(survey.answerCount).forEach((answer) => {
            const answerChoices = $("<div></div>");
            const res = survey.answersData
                .find((rightAnswer) => rightAnswer.answerId === +answer);


            answerChoices.addClass("survey-question row answer")
                .append($("<i></i>")
                    .addClass("fa fa-arrow-circle-right")
                    .tooltip({
                        title: "Type answers"
                    }));
            if (res) {
                answerChoices.append($("<span></span>")
                        .addClass("info")
                        .append(res.answer))
                    .append($("<span></span>")
                        .addClass("info")
                        .addClass("badge")
                        .tooltip({
                            title: "People answered with this option"
                        })
                        .append(survey.answerCount[answer]));
            } else {
                answerChoices.append($("<span></span>")
                        .addClass("info")
                        .append(answer))
                    .append($("<span></span>")
                        .addClass("info")
                        .addClass("badge")
                        .tooltip({
                            title: "People answered with this option"
                        })
                        .append(survey.answerCount[answer]));
            }

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
                .html((window.submitDate)
                    .replace("T", " ")
                    .replace("Z", " ")
                    .slice(0, -5)));

        caption
            .append(dateDiv)
            .append("<hr>");

        panel
            .append(panelHeading)
            .append(collapseDiv
                .append(panelBody
                    .append(infoWrapper
                        .append(thumbnailWrapper
                            .append(caption)))));
        return panel;
    };

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
            const surveyName = survey.name;
            const main = $("#main");
            window.submitDate = survey.createdAt;

            survey.surveyContentData.forEach((surveyData, index) => {
                const newRow = surveyInfo(surveyData, index, surveyName);
                main.append($(newRow));
            });
            $(".collapse").collapse("hide");
        }
    });
});
