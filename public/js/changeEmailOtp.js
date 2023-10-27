// $(document).ready(function () {
//     console.log("chk", $("#otp-form"));
//     $("#otp-form").validate({
//         rules: {
//             email: {
//                 required: true,
//                 email_validator: true,
//             }
//         },
//         messages: {
//             email: {
//                 required: "* Please enter your email",
//             }
//         }
//     })

//     jQuery.validator.addMethod(
//         "email_validator",
//         function (value, element) {
//             if (/(^[a-zA-Z_0-9\.-]+)@([a-z]{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/.test(value))
//                 return true;
//             else return false;
//         },
//         "* Please enter valid email"
//     );

// })


/* ChangeEmail validation */

$(document).ready(function () {
    $(document).on("click", "#submit", function () {
        var email = $("#oldmailaddredd").val()
        console.log("email", email);
        if (email == "") {
            $("#mememail").show()
            $("#email-con").addClass("err")

        } else {
            $("#mememail").hide()
            $("#email-con").removeClass("err")

            $.ajax({
                url: "/otp-genrate",
                method: "POST",
                data: { "email": email },
                datatype: 'json',
                success: function (data) {
                    console.log(data);
                    var parse_data = JSON.parse(data)
                    console.log(parse_data.verify);
                    if (parse_data.verify == "invalid email") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid email'
                        $("#mememail").html(content)
                        $("#mememail").show()
                    } if (parse_data.verify == "") {
                        window.location.href = "/new-email"
                    }

                }
            })
        }
    })
})
