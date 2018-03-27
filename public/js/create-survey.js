/* eslint-disable */

$(function () {
    $('#add-question-btn').hide();
    $('#continue-btn').click(function (e) {
        e.preventDefault();
        var surveyData = {
            surveyName: $('#survey-name').val(),
            category: $('#categories').val(),
        };
        var questionData = {
            questionTypes: $('.question-types').children(),
        }
        var questionTypesHolder = [];
        $.each(questionData.questionTypes, function (key, value) {
            questionTypesHolder.push($(value).attr('value'));
        });
        $('#initial-create').hide();

        $('p.survey-name').text(surveyData.surveyName);
        $('p.category').text(surveyData.category);

        $('#create-survey-form').show();
        $('#add-question-btn').show();
        // AJAX request here
    });
    $('#add-question-btn').click(function (e) {
        e.preventDefault();
        var create = $('#create-survey-form');
        $('#wrapper').append(create.html());
    });
});

/* eslint-enable */
