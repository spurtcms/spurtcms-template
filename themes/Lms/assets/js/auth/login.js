
// /* Login validation */
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
        "Please Enter at Least 1 Uppercase, 1 Lowercase, 1 Number,1 Special Character($,@),and 8 characters long"
    );


    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '* Please Enter The Valid Email Address ');

    $("form[name='loginform']").validate({
        rules: {
            email: {
                required: true,
                email_validator: true

            },
            password: {
                required: true,
                pass_validator: true

            }
        },
        messages: {
            email: {
                required: " Please Enter Your Email Address",
            },
            password: {
                required: " Please Enter Your Password ",

            }

        }
    });


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




$(document).on("click", "#submit", function () {

    var formcheck = $("form[name ='loginform']").valid()

    var email = $("#myInput").val()
    var password = $("#myPassword").val()

    console.log(formcheck, "--");

    if (formcheck == true) {

        console.log("++++");

        $("#loginform").submit();
        // $.ajax({
        //     url: "/checkmemberlogin",
        //     method: "POST",
        //     data: { "email": email, "password": password },
        //     datatype: 'json',
        //     success: function (data) {
        //         console.log(data);
        //         if (data.verify == "Email Required") {
        //             var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Email Required'
        //             $("#myInput-error").html(content)
        //             $("#myInput-error").show()
        //         }
        //         if (data.verify == "password Required") {
        //             var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />password Required'
        //             $("#myPassword-error").html(content)
        //             $("#myPassword-error").show()
        //         }
        //         if (data.verify == "your email not registered") {
        //             var content = 'your email not registered'
        //             $("#myInput-error").html(content)
        //             $("#myInput-error").show()
        //         } if (data.verify == "invalid password") {
        //             var content = 'invalid password'
        //             $("#myPassword-error").html(content)
        //             $("#myPassword-error").show()
        //         }

        //         if (data.verify == "") {
        //             window.location.href = "/"
        //         }

        //     }
        // })

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

// Password Change
$(document).on('click', '#lpswdeye', function () {

    var This = $("#myPassword")

    if ($(This).attr('type') === 'password') {

        $(This).attr('type', 'text');

        $(this).addClass('active')

    } else {

        $(This).attr('type', 'password');

        $(this).removeClass('active')

    }
})

var Cookie = getCookie("Error");

if (Cookie == "invalid+password") {

    var content = 'invalid password'
    
    $("#myPassword-error").html(content)
    
    $("#myPassword-error").show()
    
    $('#myPassword-error').parent('.ig-row').addClass('err')
    
    delete_cookie("Error")
    
} else if (Cookie == "your+email+not+registered") {
    
    var content = 'your email not registered'
    
    $("#myInput-error").html(content)
    
    $("#myInput-error").show()
    
    $("#myInput-error").parent('.ig-row').addClass('err')
    
    delete_cookie("Error")
}
