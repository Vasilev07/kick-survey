$(function () {
    $.ajax({
        method: "POST",
        async: true,
        url: "api/user-surveys",
        beforeSend: function () {

            // something to confuse the user here
        },
        error: function (error) {

        },
        success: function (survey) {
            console.log(survey);
        }
    });
});
