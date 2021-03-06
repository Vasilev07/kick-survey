/* eslint-disable no-invalid-this */
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
        const hiddenInput = $("<input />");

        // const lastResponseDiv = $("<div></div>");
        const footer = $("<div></div>");
        const responsesDiv = $("<div></div>");
        const analyzeDiv = $("<div></div>");
        const shareDiv = $("<div></div>");
        const previewDiv = $("<div></div>");
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

        analyzeDiv.addClass("survey-analyse col-xs-3 col-sm-3 col-md-3 col-lg-3")
            .append($("<a href=/analyze/" + survey.surveyData.encryptedUrl + "></a>")
                .addClass("analyze-anchor")
                .tooltip({
                    title: "Let's see how people answered your questions."
                })
                .append($("<i></i>")
                    .addClass("far fa-chart-bar")));

        shareDiv.addClass("survey-share col-xs-3 col-sm-3 col-md-3 col-lg-3")
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

        previewDiv.addClass("survey-preview col-xs-3 col-sm-3 col-md-3 col-lg-3")
            .append($("<a></a>")
                .addClass("preview-button")
                .attr("href", window.location.origin + "/preview/" + survey.surveyData.encryptedUrl)
                .tooltip({
                    title: "See how your survey looks like"
                })
                .append($("<i></i>")
                    .addClass("fas fa-file-alt")));

        deleteDiv.addClass("survey-delete col-xs-3 col-sm-3 col-md-3 col-lg-3")
            .attr("data-toggle", "modal")
            .attr("data-target", "#delete-survey-modal")
            .append($("<a></a>")
                .addClass("delete-anchor")
                .tooltip({
                    title: "Do you really need that survey?"
                })
                .append($("<i></i>")
                    .addClass("fas fa-trash")));

        hiddenInput.attr({
            type: "hidden",
            id: "survey-" + survey.surveyData.encryptedUrl,
            name: "survey",
            value: survey.surveyData.encryptedUrl
        });

        footer
            .addClass("survey-footer row")
            .append(analyzeDiv)
            .append(shareDiv)
            .append(previewDiv)
            .append(deleteDiv)
            .append(hiddenInput);

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

    const deleteSurveyCallback = function (self, e) {
        const hiddenInput = $(self)
            .parent(".survey-delete")
            .siblings("input:hidden");

        const surveyData = {
            survey: $(hiddenInput).val()
        };

        $.ajax({
            method: "DELETE",
            async: "true",
            url: "/api/delete-survey",
            data: surveyData,
            error: function (error) {
                console.log(error);
                $("#delete-survey-modal").modal("hide");
            },
            success: function (response) {
                console.log(response);
                $(self).parents(".survey").remove();
                $("#delete-survey-modal").modal("hide");
            }
        });
    };

    const serverRequest = function (reqData = null) {
        $.ajax({
            method: "POST",
            async: true,
            url: "api/user-surveys",
            data: reqData,
            beforeSend: function () {
                $(".spinner").show();
                $(".over").show();
            },
            error: function (error) {
                $(".spinner").hide();
                $(".over").hide();
                console.log(error);
            },
            success: function (surveys) {
                setTimeout(function () {
                    $(".spinner").hide();
                    $(".over").hide();
                }, 300);
                const surveysHeader = $("#main");
                if (reqData) {
                    $(".survey").remove();
                }

                if (surveys.length === 0) {
                    $("#surveys-found-status").modal("show");
                }

                surveys.forEach((survey, index) => {
                    if (index % 2 === 0) {
                        const newRow = $("<div></div>");
                        const offset = $("<div></div>");
                        newRow.addClass("row survey-row");
                        offset
                            .addClass("col-lg-10 col-lg-offset-1 col-md-10")
                            .addClass("col-md-offset-1 col-sm-10 col-sm-offset-1 offsetted");
                        surveysHeader.append(newRow);
                        const newSurvey = surveyDataPreview(survey);
                        newRow.append(offset);
                        offset.append(newSurvey);
                    } else {
                        const lastRow = $(".survey-row").last();
                        const offsetted = $(lastRow).find(".offsetted");
                        const newSurvey = surveyDataPreview(survey);
                        offsetted.append(newSurvey);
                    }
                });
            }
        }).then(function (data, status, xhr) {
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

            $(".survey").on("click", ".delete-anchor", function (e) {
                const self = this;
                $("#delete-survey-modal .delete").click(function () {
                    deleteSurveyCallback(self, e);
                });
            });
        });
    };


    serverRequest();

    $(".filter-category li.cat").on("click", function (e) {
        const cat = $(this).find("span").html();
        const dataObj = {
            category: cat
        };
        serverRequest(dataObj);
    });
});