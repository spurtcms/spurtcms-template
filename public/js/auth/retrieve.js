/* Forget Pswd otp form */

$(document).ready(function () {

    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '* Please Enter The Valid Email Address ');

    $("form[name='forgetform']").validate({
        rules: {
            email: {
                required: true,
                email_validator: true
            }
        },
            messages: {
                email: {
                    required: " Please Enter Your Email Address",
                }
            }
        
    })

})


$(document).on("click", "#submit", function () {

    var formcheck = $("form[name='forgetform']").valid()

    var email = $("#email").val()

    if (formcheck == true) {

        $.ajax({
            url: "/otp-genrate",
            method: "POST",
            data: { "email": email },
            datatype: 'json',
            success: function (data) {
                console.log(data);
                if (data.verify == "invalid email") {
                    var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid email'
                    $("#email-error").html(content)
                    $("#email-error").show()
                } if (data.verify == "") {
                    window.location.href = "/reset?emailid="+email
                }

            }
        })

    } else {

        $(document).on('keyup', ".field", function () {
            Validationcheck()
        })
        $('.ig-row').each(function () {
            var inputField = $(this).find('input');
            var inputName = inputField.attr('name');

            if (!inputField.valid()) {
                $(this).addClass("err");

            } else {
                $(this).removeClass("err")
            }

        })

    }

})

function Validationcheck() {
    let inputGro = document.querySelectorAll('.ig-row');
    inputGro.forEach(inputGroup => {
        let inputField = inputGroup.querySelector('input');
        var inputName = inputField.getAttribute('name');
        console.log("input", inputName)

        if (inputField.classList.contains('error')) {
            inputGroup.classList.add('err');
        } else {
            inputGroup.classList.remove('err');
        }

    });
}