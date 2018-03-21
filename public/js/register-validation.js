/* eslint-disable */

$(function () {
    $('#registerForm').submit(function (e) {
        e.preventDefault();
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
            success: function (response) {
                console.log('client');
                console.log(response.responseJSON);
            },
            error: function (error) {
                console.log('error ajax')
                const errorResponse = error.responseJSON;
                $('#registerErrorMsg')
                    .text(errorResponse.message)
                    .css('color', '#F00')
                    .css('float', 'right');
                if (errorResponse.errorCode === 10) {

                }
            },
        });
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
