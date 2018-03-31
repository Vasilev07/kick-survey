$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);
    let surveyData;
    $.ajax({
        method: "GET",
        async: true,
        url: "/api/statistics/" + url,
        beforeSend: function () {

            // something to confuse the user here
        },
        error: function (error) {
            console.log(error);
        },
        success: function (survey) {
            
        }
    });
});