/* eslint-disable */

$(function () {
    $('#registerForm').submit(function (e) {
        var registerData = {
            username: $('#username').val(),
            password: $('#password').val(),
            rePassword: $('#re-password').val(),
            firstName: $('#first_name').val(),
            lastName: $('#last_name').val(),
            email: $('#email').val(),
        }
        $.ajax({
            method: 'POST',
            async: true,
            url: '/validate',
            data: registerData,
            error: function (error) {
                var errorResponse = error.responseJSON;
                $('#registerErrorMsg')
                    .text(errorResponse.message)
                    .css('color', '#F00')
                    .css('float', 'right');
            },
            success: function () {
                window.location.href = '/index';
            }
        });
        return false;
    });
});

/* eslint-enable */
