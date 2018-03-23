/* eslint-disable */

$(function () {
    $('#continue-btn').click(function (e) {
        e.preventDefault();
        var surveyData = {
            surveyName: $('#survey-name').val(),
            category: $('#categories').val(),
        };
        console.log(surveyData);
        $('#initial-create').hide();

        $('p.survey-name').text(surveyData.surveyName);
        $('p.category').text(surveyData.category);

        $('#create-survey-form').show();
        // AJAX request here
    });
});

/* eslint-enable */
