/* eslint-disable */

$(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        const loginData = {
            username: $('#loginUsername').val(),
            password: $('#loginPassword').val(),
        };
        $.ajax({
            method: 'POST',
            async: true,
            url: '/login',
            data: loginData,
            error: function (error) {
                const errorResponse = error.responseJSON.message;
                $('#loginErrorMsg')
                    .text(errorResponse)
                    .css('color', '#F00')
                    .css('float', 'right');
            },
            success: function (resolve) {
                // redirecting here, because I cannot handle
                // the redirect in the /login route for some reason
                window.location.href = '/index';
            }
        });
        
    });
});


/* eslint-enable */
