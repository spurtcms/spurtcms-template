$(document).ready(function () {


    // jQuery.validator.addMethod("duplicateemail", function (value) {

    //     var result;

    //     var id = $("#id").val()

    //     $.ajax({
    //         url: "/settings/users/checkemailinuser",
    //         type: "POST",
    //         async: false,
    //         data: { "email": value, "id": id, csrf: $("input[name='csrf']").val() },
    //         datatype: "json",
    //         caches: false,
    //         success: function (data) {

    //             result = data.trim();

    //         }
    //     })
    //     return result.trim() != "true"
    // })

    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, ' Please Enter The Valid Email Address ');

    // only allow numbers
    $('#otp').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    // $.validator.addMethod("otp_validator", function (value) {
    //     return /(^[0-9])$/.test(value);
    // }, ' Please Enter 6 Digit Number ');

    $("form[name='changeemail']").validate({
        rules: {
            otp: {
                required: true,
                // otp_validator :true
            },
            emailaddress: {
                required: true,
                email_validator: true
            },
            confrimemail: {
                required: true,
                equalTo: "#emailaddress"
            }
        },
        messages: {
            otp: {
                required: "Please Enter The Otp "
            },
            emailaddress: {
                required: " Please Enter Your Email Address",
            },
            confrimemail: {
                required: " Please Re-Enter Your Email Address ",
                equalTo: " Please Re-Enter The Same Email Address"
            }
        }
    });




    // console.log("email", otp, newemail, confirmemail);
    // if (otp == "" && newemail == "" && confirmemail == "") {
    //     $("#memotp").show()
    //     $("#mememail").show()
    //     $("#mem-co-email").show()
    //     $("#otp-con").addClass("err")
    //     $("#email-con").addClass("err")
    //     $("#confrimemail-con").addClass("err")
    // } if (otp == "") {
    //     $("#memotp").show()
    //     $("#otp-con").addClass("err")


    // } if (newemail == "") {
    //     $("#mememail").show()
    //     $("#email-con").addClass("err")


    // } if (confirmemail == "") {

    //     $("#mem-co-email").show()
    //     $("#confrimemail-con").addClass("err")


    // } else {
    //     $("#memotp").hide()
    //     $("#mememail").hide()
    //     $("#mem-co-email").hide()
    //     $("#otp-con").removeClass("err")
    //     $("#email-con").removeClass("err")
    //     $("#confrimemail-con").removeClass("err")

    // }
})

$(document).on("click", "#changeemailsubmit", function () {

    var formcheck = $("form[name ='changeemail']").valid()

    var url = window.location.search;
    const urlpar = new URLSearchParams(url);
    oldemailid = urlpar.get('changeemail');
    var otp = $("#otp").val()
    var newemail = $("#emailaddress").val()
    var confirmemail = $("#confirmemail").val()
    console.log("ss", newemail, confirmemail, otp);
    if (formcheck == true) {
        $.ajax({
            url: "/verify-email-otp",
            method: "POST",
            data: { "otp": otp, "newemail": newemail, "confirmemail": confirmemail ,"oldemailid":oldemailid },
            datatype: 'json',
            success: function (data) {
                console.log(data);
                console.log(data.verify);
                if (data.verify == "Otp Required") {
                    var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Otp Required'
                    $("#otp-error").html(content)
                    $("#otp-error").show()
                }   if (data.verify == "Email Required") {
                    var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Email Required'
                    $("#emailaddress-error").html(content)
                    $("#emailaddress-error").show()
                } if (data.verify == "invalid otp") {
                    var content = 'invalid otp'
                    $("#otp-error").html(content)
                    $("#otp-error").show()
                    $('#otp-error').parents('.input-container').addClass("err");
                } if (data.verify == "otp exipred") {
                    var content = 'otp exipred'
                    $("#otp-error").html(content)
                    $("#otp-error").show()
                    $('#otp-error').parents('.input-container').addClass("err");
                } if (data.verify == "") {
                    window.location.href = "/myprofile"
                }

            }
        })


    } else {

      
        $('.input-container').each(function () {
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

$(document).on('keyup', ".field", function () {
    Validationcheck()
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
/* Resend Otp */
$(document).on("click", "#againotp", function () {

    var url = window.location.search;
    const urlpar = new URLSearchParams(url);
    email = urlpar.get('changeemail');


    $.ajax({
        url: "/send-otp-genrate",
        method: "POST",
        data: { "email": email },
        datatype: 'json',
        success: function (data) {
            notify_content = '<div class="toast-msg sucs-green"> <a id="cancel-notify"> <img src="/public/img/x-black.svg" alt="" class="rgt-img" /></a> <img src="/public/img/group-12.svg" alt="" class="left-img" /> <span>' + languagedata.Toast[key] + '</span></div>';
            $(notify_content).insertBefore(".header-rht");
            setTimeout(function () {
                $('.toast-msg').fadeOut('slow', function () {
                    $(this).remove();
                });
            }, 5000); // 5000 milliseconds = 5 seconds

        }
    })


})