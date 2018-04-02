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
    const addAnswer = function () {
        const answerWrapper = $("<div></div>").addClass("form-group answer");
        const label = $("<label></label>")
            .addClass("control-label col-sm-3 col-xs-3 col-md-3 col-lg-3")
            .attr("for", "question")
            .html("Answer");

        const inputWrapper = $("<div></div>")
            .addClass("control-label col-sm-6 col-xs-6 col-md-6 col-lg-6")
            .append($("<input>")
                .addClass("form-control")
                .attr("type", "text")
                .attr("placeholder", "Enter answer")
                .attr("name", "answer")
            );
        const buttonWrapper = $("<div></div>")
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
        $("button.center-block").show();

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

        const info = $("<div class=\"survey-info\"></div>")
            .append($("<h4 class=\"survey-info\"></h4>").text(surveyData.surveyName))
            .append($("<h4 class=\"survey-info\"></h4>").text(surveyData.category));
        $("#info")
            .append(info);
        $("#question").show();
    });

    // if selected multiple-choice or single choice calls addAnswer()
    $("select.question-types").on("change", function () {
        $(".answer").remove();
        const answerType = $("select.question-types option:selected").attr("value");
        const answersWrapper = $("#answers");

        if (answerType === "single-choice" || answerType === "multiple-choice") {
            const newElement = addAnswer();
            answersWrapper.append(newElement);
        }
    });

    // when add new answer gives class delete-last to last delete button
    $(document).on("click", ".add-answer-btn", function (e) {
        e.preventDefault();
        $(".delete-last").removeClass("delete-last");
        const answersWrapper = $("#answers");
        $(".prev").remove();
        const newElement = addAnswer();
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

<<<<<<< HEAD
    $("#create-form").submit(function (e) {
        e.preventDefault();
        var surveyQuestionsAnswers = [];

        // $(".full-question-info")
        //     .each(function (_, el) {
        //         surveyQuestionsAnswers.push({
        //             question: $(el).find("input[name=\"question\"]").val(),
        //             answerType: $(el).find("select[name=\"question-type\"]").val()

        //             // todo array of answers
        //         });
        //     });
        var submitObj = {
            userId: user.id,
            username: user.username,
            surveyName: $("#survey-name").val(),
            surveyCategory: $("select[name='survey-type']").val(),
            surveyData: surveyQuestionsAnswers
        };
        console.log(submitObj);

        // $.ajax({
        //     method: "POST",
        //     async: true,
        //     url: "/create",
        //     data: submitObj,
        //     error: function (error) {
        //         alert('Error saving order');
        //     },
        //     success: function (resolve) {
        //         console.log(resolve);
        //     }
        // });
    });

=======
>>>>>>> 9bef32399f5ba2aa34dfafcc239c8796dd0d15b5
    $("#generate-share").click(function (e) {
        e.preventDefault();
        const surveyData = {
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
        var qName = $("#create-form .form-control").val();
        var qType = $("#create-form .question-types").val();
        var answers = $("#create-form [name='answer']");

        var question = $("#question-list");

        var questionListWrapper = $("<div></div>").addClass("row");

        question.append(
            questionListWrapper
            .append($("<div></div>")
                .addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3")
                .append($("<h3></h3>")
                    .addClass("survey-info")
                    .html((qCounter.id) + ". " + qName)))
            .append($("<div></div>")
                .addClass("col-xs-9 col-sm-9 col-md-9 col-lg-9 survey-info")
                .append($("<h3></h3>").html(qType)))
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
    $(".done").on("click", function (e) {
        e.preventDefault();
        $("#edit-create").modal("hide");

        const obj = {
            question: null,
            questionType: null,
            isRequired: 0,
            answers: []
        };

        obj.question = $("input[name='question']").val();
        obj.questionType = $("select[name='question-type']").val();
        obj.isRequired = $("input[name='is-required']").is(":checked") ? 1 : 0;
        $("input[name='answer']").each(function(index, element) {
            obj.answers.push($(element).val());
        });
        obj.answers = obj.answers.length ? obj.answers : "";
        questionAnswers.push(obj);
    });
    $("#create-survey").on("click", function(e) {
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