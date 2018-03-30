$(function () {
    let user;
    $.ajax({
        method: "POST",
        async: true,
        url: "/get-user",
        error: function (error) {
            console.log(error);
        },
        success: function (resolve) {
            user = resolve;
            console.log(user);
        }
    });
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

        $("p.survey-name").text(surveyData.surveyName);
        $("p.category").text(surveyData.category);

        $("#create-survey-form").show();
        $("#add-question-btn").show();

        $("#create-survey-form").show();
        $("#add-question-btn").show();
        $("#done-btn").show();

        // AJAX request here
    });
    $("#add-question-btn").click(function (e) {
        e.preventDefault();
        const create = $("#create-survey-form");
        $("#wrapper").append(create.html());
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
