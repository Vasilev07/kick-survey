$(function () {
    var user;
    var surveyData;
    var questionData;
    var questionTypesHolder;
    var qCounter = {
        id: 1
    };
    var questionAnswers = [];

    $.ajax({
        method: "POST",
        async: true,
        url: "/get-user",
        error: function (error) {
            console.log(error);
        },
        success: function (resolve) {
            user = resolve;
        }
    });

    $("#generate-share").hide();
    $("#edit-create-btn").hide();
    $("button.center-block").hide();
    $("#question").hide();

    // function that adds answer to modal btn
    var addAnswer = function () {
        var answerWrapper = $("<div></div>").addClass("form-group answer");
        var label = $("<label></label>")
            .addClass("control-label col-sm-3 col-xs-3 col-md-3 col-lg-3")
            .attr("for", "question")
            .html("Answer");

        var inputWrapper = $("<div></div>")
            .addClass("control-label col-sm-6 col-xs-6 col-md-6 col-lg-6")
            .append($("<input>")
                .addClass("form-control")
                .attr("type", "text")
                .attr("placeholder", "Enter answer")
                .attr("name", "answer")
            );
        var buttonWrapper = $("<div></div>")
            .addClass("control-label col-sm-3 col-xs-3 col-md-3 col-lg-3")
            .append($("<a></a>")
                .addClass("btn btn-success add-answer-btn prev")
                .append($("<i></i>").addClass("fas fa-plus")))
            .append($("<a></a>")
                .addClass("btn btn-danger delete-answer-btn delete-last")
                .append($("<i></i>").addClass("fas fa-minus")));
        $(answerWrapper).append(label).append(inputWrapper).append(buttonWrapper);

        return answerWrapper;
    };

    $("#continue-btn").click(function (e) {
        e.preventDefault();
        if ($("#survey-name").val()) {
            surveyData = {
                surveyName: $("#survey-name").val(),
                category: $("#categories").val()
            };
            questionData = {
                questionTypes: $(".question-types").children()
            };
            questionTypesHolder = [];
            $.each(questionData.questionTypes, function (key, value) {
                questionTypesHolder.push($(value).attr("value"));
            });
            $("#initial-create").hide();

            var info = $("<div></div>")
                .addClass("survey-info")
                .append($("<h4></h4>")
                    .addClass("survey-info").text(surveyData.surveyName))
                .append($("<h4></h4>")
                    .addClass("survey-info").text(surveyData.category));
            $("#info")
                .append(info);
            $("#question").show();
            $(".add-submit").show();
        } else {
            $("#survey-name")
                .siblings("label")
                .html("Survey name shoud not be blank.")
                .css("color", "#f00");
        }
    });

    // if selected multiple-choice or single choice calls addAnswer()
    $("select.question-types").on("change", function () {
        $(".answer").remove();
        var answerType = $("select.question-types option:selected").attr("value");
        var answersWrapper = $("#answers");

        if (answerType === "single-choice" || answerType === "multiple-choice") {
            var newElement = addAnswer();
            answersWrapper.append(newElement);
        }
    });

    // when add new answer gives class delete-last to last delete button
    $(document).on("click", ".add-answer-btn", function (e) {
        e.preventDefault();
        $(".delete-last").removeClass("delete-last");
        var answersWrapper = $("#answers");
        $(".prev").remove();
        var newElement = addAnswer();
        answersWrapper.append(newElement);
    });

    // deletes the answer and if it's last add PLUS to the last field
    $(document).on("click", ".delete-answer-btn", function (e) {
        e.preventDefault();
        $(this).parents(".answer").remove();
        if ($(this).hasClass("delete-last")) {
            $(".answer")
                .last()
                .find(".delete-answer-btn")
                .addClass("delete-last")
                .before($("<a></a>")
                    .addClass("btn btn-success add-answer-btn prev")
                    .append($("<i></i>").addClass("fas fa-plus")));
        }
    });

    $("#generate-share").click(function (e) {
        e.preventDefault();
        var surveyData = {
            surveyName: $("#survey-name").val()
        };
        console.log(surveyData);
        $.ajax({
            method: "POST",
            async: true,
            url: "/generate-share",
            data: surveyData,
            error: function (error) {
                console.log(error);
            },
            success: function (resolve) {
                $("#generate-share")
                    .attr("type", "text")
                    .attr("readonly", "true")
                    .attr("value", resolve)
                    .removeClass().off("click");
            }
        });
    });

    $(".done").on("click", function (e) {
        e.preventDefault();
        $("#edit-create").modal("hide");

        var obj = {
            question: null,
            questionType: null,
            isRequired: 0,
            answers: []
        };
        obj.question = $("input[name='question']").val();
        obj.questionType = $("select[name='question-type']").val();
        obj.isRequired = $("input[name='is-required']").is(":checked") ? 1 : 0;
        $("input[name='answer']").each(function (index, element) {
            obj.answers.push($(element).val());
        });
        obj.answers = obj.answers.length ? obj.answers : "";
        questionAnswers.push(obj);

        var qName = $("#create-form .form-control").val();
        var answers = $("#create-form [name='answer']");
        var question = $("#question-list");

        var questionListWrapper = $("<div></div>").addClass("question-wrapper");

        question.append(
            questionListWrapper
            .append($("<span></span>")
                .addClass("survey-info")
                .html((qCounter.id) + ". " + qName))
        );
        if (answers.length > 0) {
            $.each(answers, function (key, val) {
                var answers =
                    $("<label></label>")
                    .append($("<input>")
                        .attr("type", "checkbox")
                        .attr("value", "3")
                        .text($(val).val()));

                question.append(
                    questionListWrapper
                    .append($("<div></div>").addClass("checkbox")
                        .append(answers))
                );
            });
        }
        qCounter.id++;
    });

    $("#create-survey").on("click", function (e) {
        e.preventDefault();
        var submissionModal = $("#submission-survey-modal");
        surveyData.questionData = questionAnswers;
        $.ajax({
            method: "POST",
            async: true,
            url: "/create",
            data: surveyData,
            error: function () {
                submissionModal.modal("show");
                $("i.reject").show();
                $("span.reject").show();
            },
            success: function () {
                submissionModal.modal("show");
                $("i.success").show();
                $("span.success").show();
            }
        });
    });

    $(".modal").on("hidden.bs.modal", function () {
        $(".form-control").val("");
        $(".question-types").val("slider");
    });
});
