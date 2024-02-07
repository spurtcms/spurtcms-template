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

// $(document).on("click", "#changepasssubmit", function () {

//     var url = window.location.search;
//     const urlpar = new URLSearchParams(url);
//     id = urlpar.get('emailid');

//     var formcheck = $("form[name ='changepasswordform']").valid()

//     var otp = $("#otp").val()
//     var newpassword = $("#mynewPassword").val()
//     var confirmpassword = $("#confrimPassword").val()
//     if (formcheck == true) {
//         $.ajax({
//             url: "/verify-otppass",
//             method: "POST",
//             data: { "id": id, "otp": otp, "mynewPassword": newpassword, "confrimPassword": confirmpassword },
//             datatype: 'json',
//             success: function (data) {
//                 if (data.verify == "Otp Required") {
//                     var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Otp Required'
//                     $("#otp-error").html(content)
//                     $("#otp-error").show()
//                 } if (data.verify == "Password Required") {
//                     var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Password Required'
//                     $("#mynewPassword-error").html(content)
//                     $("#mynewPassword-error").show()
//                 } if (data.verify == "invalid otp") {
//                     var content = 'invalid otp'
//                     $("#otp-error").html(content)
//                     $("#otp-error").show()
//                     $('#otp-error').parents('.input-container').addClass("err");
//                 } if (data.verify == "otp exipred") {
//                     var content = 'otp exipred'
//                     $("#otp-error").html(content)
//                     $("#otp-error").show()
//                     $('#otp-error').parents('.input-container').addClass("err");
//                 } if (data.verify == "") {
//                     window.location.href = "/myprofile"
//                 }

//             }
//         })

//     } else {

//         $(document).on('keyup', ".field", function () {
//             Validationcheck()
//         })
//         $('.input-container').each(function () {
//             var inputField = $(this).find('input');
//             var inputName = inputField.attr('name');

//             if (!inputField.valid()) {
//                 $(this).addClass("err");

//             } else {
//                 $(this).removeClass("err")
//             }
//         })
//     }


// })

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
// /* Resend Otp */
// $(document).on("click", "#againotp", function () {

//     var url = window.location.search;
//     const urlpar = new URLSearchParams(url);
//     email = urlpar.get('emailid');


//     $.ajax({
//         url: "/send-otp-genrate",
//         method: "POST",
//         data: { "email": email },
//         datatype: 'json',
//         success: function (data) {

//         }
//     })


// })