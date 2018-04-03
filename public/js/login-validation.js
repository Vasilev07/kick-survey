/* eslint-disable */

$(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        var loginData = {
            username: $('#loginUsername').val(),
            password: $('#loginPassword').val(),
        };
        $.ajax({
            method: 'POST',
            async: true,
            url: '/login',
            data: loginData,
            error: function (error) {
                var errorResponse = error.responseJSON.message;
                $('#loginErrorMsg')
                    .text(errorResponse)
                    .css('color', '#F00')
                    .css('float', 'right');
            },
            success: function (resolve) {
                window.location.href = '/index';
            }
        });
        
    });
});


/* eslint-enable */
