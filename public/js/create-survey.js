$(function () {
    var user;
    var questionId = {
        id: 0
    };
    var surveyData;
    var questionData;
    var questionTypesHolder;

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


    $("#continue-btn").click(function (e) {
        e.preventDefault();
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

        var info = $("<div class=\"survey-info\"></div>")
            .append($("<h4 class=\"survey-info\"></h4>").text(surveyData.surveyName))
            .append($("<h4 class=\"survey-info\"></h4>").text(surveyData.category));
        $("#info")
            .append(info);
        $("#question").show();
    });

    $("#add-question-btn").click(function (e) {
        e.preventDefault();
        var create = $('.full-question-info').html();
        var fullInfo = $('<div></div>')
            .addClass('container full-question-info')
            .append(create);
        $('#wrapper').append(fullInfo);
    });

    $("#create-survey-form").submit(function (e) {
        e.preventDefault();
        var surveyQuestionsAnswers = [];
        const userId = {};
        $('.full-question-info')
            .each(function (_, el) {
                surveyQuestionsAnswers.push({
                    question: $(el).find('input[name="question"]').val(),
                    answerType: $(el).find('select[name="question-type"]').val(),
                    // todo array of answers
                }, );
            });
        var submitObj = {
            userId: user.id,
            username: user.username,
            surveyName: $("#survey-name").val(),
            surveyCategory: $("select[name='survey-type']").val(),
            surveyData: surveyQuestionsAnswers,
        }
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
});