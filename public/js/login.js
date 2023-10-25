
/* Login validation */

$(document).ready(function () {
    $(document).on("click", "#submit", function () {
        var email = $("#myInput").val()
        var password = $("#myPassword").val()
        if (email == "" && password == "") {
            $("#mememail").show()
            $("#email-con").addClass("err")
            $("#mempass").show()
            $("#pass-con").addClass("err")

        } if (email == "") {
            $("#mememail").show()
            $("#email-con").addClass("err")

        } if (password == "") {
            $("#mempass").show()
            $("#pass-con").addClass("err")
        } else {
            $("#mememail").hide()
            $("#mempass").hide()
            $("#email-con").addClass("err")
            $("#pass-con").removeClass("err")

            $.ajax({
                url: "/checkmemberlogin",
                method: "POST",
                data: { "email": email, "password": password },
                datatype: 'json',
                success: function (data) {
                    console.log(data);
                    var parse_data = JSON.parse(data)
                    console.log(parse_data.verify);
                    if (parse_data.verify == "your email not registered") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />your email not registered'
                        $("#mememail").html(content)
                        $("#mememail").show()
                    } if (parse_data.verify == "invalid password") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid password'
                        $("#mempass").html(content)
                        $("#mempass").show()
                    } if (parse_data.verify == "") {
                        window.location.href = "/index"
                    }

                }
            })
        }
    })
})