$(function () {
    let user;
    let surveyData;
    let questionData;
    let questionTypesHolder;
    let qCounter = {
        id: 1
    };
    let questionAnswers = [];

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
    let addAnswer = function () {
        let answerWrapper = $("<div></div>").addClass("form-group answer");
        let label = $("<label></label>")
            .addClass("control-label col-sm-3 col-xs-3 col-md-3 col-lg-3")
            .attr("for", "question")
            .html("Answer");

        let inputWrapper = $("<div></div>")
            .addClass("control-label col-sm-6 col-xs-6 col-md-6 col-lg-6")
            .append($("<input>")
                .addClass("form-control")
                .attr("type", "text")
                .attr("placeholder", "Enter answer")
                .attr("name", "answer")
            );
        let buttonWrapper = $("<div></div>")
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

            let info = $("<div class=\"survey-info\"></div>")
                .append($("<h4 class=\"survey-info\"></h4>").text(surveyData.surveyName))
                .append($("<h4 class=\"survey-info\"></h4>").text(surveyData.category));
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
        let answerType = $("select.question-types option:selected").attr("value");
        let answersWrapper = $("#answers");

        if (answerType === "single-choice" || answerType === "multiple-choice") {
            let newElement = addAnswer();
            answersWrapper.append(newElement);
        }
    });

    // when add new answer gives class delete-last to last delete button
    $(document).on("click", ".add-answer-btn", function (e) {
        e.preventDefault();
        $(".delete-last").removeClass("delete-last");
        let answersWrapper = $("#answers");
        $(".prev").remove();
        let newElement = addAnswer();
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
        let surveyData = {
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

    $(".done").on("click", function () {
        let qName = $("#create-form .form-control").val();
        let qType = $("#create-form .question-types").val();
        let answers = $("#create-form [name='answer']");
        let inputHidden = $("<input>");
        let deleteBtn = $("<i></i>");

        deleteBtn.addClass("fas fa-trash delete-question");
        inputHidden.attr("type", "hidden");
        inputHidden.attr("value", "qName");

        let question = $("#question-list");

        let questionListWrapper = $("<li></li>").addClass("question-wrapper");

        question.append(
            questionListWrapper
            .append($("<span></span>")
                .addClass("survey-info")
                .html(qName))
            .append(deleteBtn)
            .append(inputHidden)
        );
        if (answers.length > 0) {
            $.each(answers, function (key, val) {
                let answers = $("<label></label>")
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
    $(".done").on("click", function (e) {
        e.preventDefault();
        $("#edit-create").modal("hide");

        let obj = {
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
    });

    $(document).on("click", ".delete-question", function() {
        var input = $(this).siblings("input[type='hidden']");
        var questionName = input.val();
        var questionIndex;

        var foundQuestion = questionAnswers.find((question, index) => {
            questionIndex = index;
            return question.question === questionName;
        });

        questionAnswers.splice(questionIndex, 1);
        var questionWrapper = $(this).parents('.question-wrapper');
        questionWrapper.remove();
    });

    $("#create-survey").on("click", function (e) {
        e.preventDefault();

        surveyData.questionData = questionAnswers;
        $.ajax({
            method: "POST",
            async: true,
            url: "/create",
            data: surveyData,
            error: function (error) {
                console.log(error);
            },
            success: function (resolve) {
                console.log(resolve);
            }
        });
    });
});
