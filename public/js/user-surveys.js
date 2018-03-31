$(function () {
    const selectText = function (element) {
        const doc = document;
        const text = $(element)[0];
        let range;
        let selection;

        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const surveyDataPreview = function (survey) {
        const surveyWrapper = $("<div></div>");
        const thumbnailWrapper = $("<div></div>");
        const captionWrapper = $("<div></div>");
        const titleDiv = $("<div></div>");
        const catDiv = $("<div></div>");
        const dateDiv = $("<div></div>");

        // const lastResponseDiv = $("<div></div>");
        const footer = $("<div></div>");
        const responsesDiv = $("<div></div>");
        const analyzeDiv = $("<div></div>");
        const shareDiv = $("<div></div>");
        const deleteDiv = $("<div></div>");

        surveyWrapper.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 survey");
        thumbnailWrapper.addClass("thumbnail");
        captionWrapper.addClass("caption");

        titleDiv.addClass("survey-title row")
            .append($("<i></i>")
                .addClass("fas fa-heading")
                .tooltip({
                    title: "Survey title"
                }))
            .append($("<span></span>")
                .html(survey.surveyData.name));

        catDiv.addClass("survey-cat row")
            .append($("<i></i>")
                .addClass("fas fa-folder")
                .tooltip({
                    title: "Category"
                }))
            .append($("<span></span>")
                .html(survey.surveyData.category));

        dateDiv.addClass("survey-date row")
            .append($("<i></i>")
                .addClass("fas fa-calendar-alt")
                .tooltip({
                    title: "Creation date"
                }))
            .append($("<span></span>")
                .html((survey.surveyData.createdAt)
                    .replace("T", " ")
                    .replace("Z", " ")
                    .slice(0, -5)));

        responsesDiv.addClass("survey-responses row")
            .append($("<i></i>")
                .addClass("fas fa-reply-all")
                .tooltip({
                    title: "Responses"
                }))
            .append($("<span></span>")
                .html(survey.surveyData.uniqueSubmits));

        analyzeDiv.addClass("survey-analyse col-md-4")
            .append($("<a href=/analyze/" + survey.surveyData.encryptedUrl + "></a>")
                .addClass("analyze-anchor")
                .tooltip({
                    title: "Let's see how people answered your questions."
                })
                .append($("<i></i>")
                    .addClass("far fa-chart-bar")));

        shareDiv.addClass("survey-share col-md-4")
            .append($("<button></button>")
                .addClass("share-button")
                .popover({
                    trigger: "manual",
                    placement: "bottom",
                    html: false,
                    content: window.location.origin +
                        "/preview/" + survey.surveyData.encryptedUrl
                })
                .tooltip({
                    title: "Share your survey with the world!"
                })
                .append($("<i></i>")
                    .addClass("fas fa-share-alt")));

        deleteDiv.addClass("survey-delete col-md-4")
            .append($("<a></a>")
                .addClass("delete-anchor")
                .tooltip({
                    title: "Do you really need that survey?"
                })
                .append($("<i></i>")
                    .addClass("fas fa-trash")));

        footer
            .addClass("survey-footer row")
            .append(analyzeDiv)
            .append(shareDiv)
            .append(deleteDiv);

        captionWrapper
            .append(titleDiv)
            .append("<hr>")
            .append(catDiv)
            .append("<hr>")
            .append(dateDiv)
            .append("<hr>")
            .append(responsesDiv)
            .append("<hr>")
            .append(footer);
        surveyWrapper.append(thumbnailWrapper.append(captionWrapper));

        return surveyWrapper;
    };

    $.ajax({
        method: "POST",
        async: true,
        url: "api/user-surveys",
        beforeSend: function () {

            // something to confuse the user here
        },
        error: function (error) {

        },
        success: function (surveys) {
            console.log(surveys);
            const surveysHeader = $("#main");
            surveys.forEach((survey) => {
                const newRow = surveyDataPreview(survey);
                surveysHeader.append($(newRow));
            });

            $(".survey").on("click", ".share-button", function () {
                $(this).popover("toggle");
                selectText(".popover-content");

                const self = this;
                $(document).mouseup(function (e) {
                    const container = $(".popover");
                    if (!container.is(e.target) && container.has(e.target).length === 0 &&
                        !$(self).is(e.target) && $(self).has(e.target).length === 0) {
                        $(self).popover("hide");
                    }
                });
            });
        }
    });
});