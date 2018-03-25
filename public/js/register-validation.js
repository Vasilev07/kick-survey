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
                const errorResponse = error.responseJSON;
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
        // var userName = $('#user-name').val();
        // // $(userName).css('font-weight', 'bold');
        // // get value from input field
        // $('#user-name').val('');
        // $('#email').val('');
        // $('#pwd').val('');
        // // delete input field text
        // $("#greeting-message").html(`Hello <b>${userName}</b>. Thank you for using our application. We hope you enjoy our services.`);
        // return false;
    });
});

/* eslint-enable */
