$(function () {
    let user;
    let surveyData;
    let questionData;
    let questionTypesHolder;
    const questionAnswers = [];

    $.ajax({
        method: "POST",
        async: true,
        url: "/api/get-user",
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
        e.preventDefault();
        let ifSurveyExist;

        if ($("#survey-name").val()) {
            surveyData = {
                surveyName: $("#survey-name").val(),
                category: $("#categories").val()
            };

            const dataToCheck = {
                surveyName: surveyData.surveyName,
                userId: user.id
            };

            $.ajax({
                method: "POST",
                async: false,
                url: "/api/check-survey-name",
                data: dataToCheck,
                error: function (error) {
                    console.log(error);
                },
                success: function (resolve) {
                    ifSurveyExist = resolve;
                }
            });

            if (ifSurveyExist) {
                $(".survey-name-exist-msg label").html("You have a survey with that name");
            } else {
                questionData = {
                    questionTypes: $(".question-types").children()
                };
                questionTypesHolder = [];
                $.each(questionData.questionTypes, function (key, value) {
                    questionTypesHolder.push($(value).attr("value"));
                });
                $("#initial-create").hide();

                const info = $("<div></div>")
                    .addClass("survey-info")
                    .append($("<h4></h4>")
                        .addClass("survey-info").text(surveyData.surveyName))
                    .append($("<h4></h4>")
                        .addClass("survey-info").text(surveyData.category));
                $("#info")
                    .append(info);
                $("#question").show();
                $(".add-submit").show();
            }
        } else {
            $("#survey-name")
                .siblings("label")
                .html("Survey name should not be blank.")
                .css("color", "#f00");
        }
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

    $("#generate-share").click(function (e) {
        e.preventDefault();
        const surveyData = {
            surveyName: $("#survey-name").val()
        };

        $.ajax({
            method: "POST",
            async: true,
            url: "/api/generate-share",
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

        const obj = {
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

        const qName = $("#create-form .form-control").val();
        const answers = $("#create-form [name='answer']");
        const question = $("#question-list");

        const inputHidden = $("<input>");
        const deleteBtn = $("<i></i>");

        deleteBtn.addClass("fas fa-trash delete-question");
        inputHidden.attr("type", "hidden");
        inputHidden.attr("value", "qName");

        const questionListWrapper = $("<li></li>").addClass("question-wrapper");

        if (qName) {
            question.append(
                questionListWrapper
                .append($("<span></span>")
                    .addClass("survey-info"))
                .html(qName)
                .append(deleteBtn)
                .append(inputHidden)
            );
            $("#edit-create").modal("hide");
        } else {
            $("#warning-question-label")
                .html("Survey name should not be blank.")
                .addClass("warning-placeholder");
        }
    });

    $(document).on("click", ".delete-question", function () {
        const input = $(this).siblings("input[type='hidden']");
        const questionName = input.val();
        let questionIndex;

        const foundQuestion = questionAnswers.find((question, index) => {
            questionIndex = index;
            return question.question === questionName;
        });

        questionAnswers.splice(questionIndex, 1);
        const questionWrapper = $(this).parents(".question-wrapper");
        questionWrapper.remove();
    });

    $("#create-survey").on("click", function (e) {
        e.preventDefault();
        const submissionModal = $("#submission-survey-modal");
        surveyData.questionData = questionAnswers;
        $.ajax({
            method: "POST",
            async: true,
            url: "/api/create",
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

                $(".modal").on("hidden.bs.modal", function () {
                    window.location.href = "/index";
                });
            }
        });
    });

    $(".modal").on("hidden.bs.modal", function () {
        $(".form-control").val("");
        $(".question-types").val("slider");
        $("#warning-question-label").html("");
        $("#answers").remove();
    });
});
