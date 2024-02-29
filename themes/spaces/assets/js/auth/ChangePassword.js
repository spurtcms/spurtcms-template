$(document).ready(function () {

    jQuery.validator.addMethod(
        "pass_validator",
        function (value, element) {
            if (value != "") {
                if (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/.test(value))
                    return true;
                else return false;
            }
            else return true;
        },
        " Please Enter at Least 1 Uppercase, 1 Lowercase, 1 Number,1 Special Character($,@),and 8 characters long",
    );


    // $.validator.addMethod("otp_validator", function (value) {
    //     return /(^[0-9]\g){1,6}$/.test(value);
    // }, ' Please Enter 6 Digit Number ');


    $.validator.addMethod("otp_validator", function (value) {
        return /^\d{6}$/.test(value);
    }, '* Please Enter 6 Digit Number');

    $("form[name='changepasswordform']").validate({
        rules: {
            otp: {
                required: true,
                otp_validator: true
            },
            mynewPassword: {
                required: true,
                pass_validator: true
            },
            confrimPassword: {
                required: true,
                equalTo: "#mynewPassword"
            }
        },
        messages: {
            otp: {
                required: "Please Enter The Otp "
            },
            mynewPassword: {
                required: " Please Enter Your New Password",
            },
            confrimPassword: {
                required: " Please Re-Enter Your New Password ",
                equalTo: " Please Enter The Same New Password"
            }
        }
    });

})

function Validationcheck() {
    let inputGro = document.querySelectorAll('.input-container');
    inputGro.forEach(inputGroup => {
        let inputField = inputGroup.querySelector('input');
        var inputName = inputField.getAttribute('name');

        if (inputField.classList.contains('error')) {
            inputGroup.classList.add('err');
        } else {
            inputGroup.classList.remove('err');
        }

    });
}

// Password Change
$(document).on('click', '#pswdeye', function () {

    if ($("#mynewPassword").attr('type') == 'password') {

        $("#mynewPassword").attr('type', 'text');

        $(this).addClass('active')

    } else {

        $("#mynewPassword").attr('type', 'password');

        $(this).removeClass('active')
    }
})

// Password Change
$(document).on('click', '#cpswdeye', function () {

    var This = $("#confrimPassword")

    if ($(This).attr('type') === 'password') {

        $(This).attr('type', 'text');

        $(this).addClass('active')

    } else {

        $(This).attr('type', 'password');

        $(this).removeClass('active')

    }
})
