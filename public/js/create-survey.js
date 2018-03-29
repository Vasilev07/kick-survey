$(function () {
    $("#done-btn").hide();
    $("#add-question-btn").hide();
    $("#continue-btn").click(function (e) {
        e.preventDefault();
        const surveyData = {
            surveyName: $("#survey-name").val(),
            category: $("#categories").val()
        };
        const questionData = {
            questionTypes: $(".question-types").children()
        };
        const questionTypesHolder = [];
        $.each(questionData.questionTypes, function (key, value) {
            questionTypesHolder.push($(value).attr("value"));
        });
        $("#initial-create").hide();

        $("h3.survey-name").text(surveyData.surveyName);
        $("h3.category").text(surveyData.category);

        $("#create-survey-form").show();
        $("#add-question-btn").show();

        $('#create-survey-form').show();
        $('#add-question-btn').show();
        $('#done-btn').show();

        // AJAX request here
    });
    $("#add-question-btn").click(function (e) {
        e.preventDefault();
        var create = $('.full-question-info').html();
        var fullInfo = $('<div></div>')
            .addClass('full-question-info')
            .append(create);
        $('#wrapper').append(fullInfo);
    });

    $("#create-survey-form").submit(function (e) {
        e.preventDefault();
        var surveyQuestionsAnswers = [];
        $('.full-question-info')
            .each(function (_, el) {
                surveyQuestionsAnswers.push({
                    question: $(el).find('input[name="question"]').val(),
                    answerType: $(el).find('select[name="question-type"]').val(),
                }, );
            });
        var submitObj = {
            surveyName:  $("#survey-name").val(),
            surveyCategory: $("select[name='survey-type']").val(),
            surveyData: surveyQuestionsAnswers,
        }
        $.ajax({
            method: "POST",
            async: true,
            url: "/submit",
            data: submitObj,
            error: function (error) {
                console.log(error);                
            }, 
            success: function (resolve) {
                window.location.href = '/submit';
            }
        });
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