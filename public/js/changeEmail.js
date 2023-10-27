$(document).ready(function () {
    $(document).on("click", "#submit", function () {
        var otp = $("#otp").val()
        var newemail = $("#emailaddress").val()
        var confirmemail = $("#confirmemail").val()
        console.log("email", otp, newemail, confirmemail);
        if (otp == "" && newemail == "" && confirmemail == "") {
            $("#memotp").show()
            $("#mememail").show()
            $("#mem-co-email").show()
            $("#otp-con").addClass("err")
            $("#email-con").addClass("err")
            $("#confrimemail-con").addClass("err")
        } if (otp == "") {
            $("#memotp").show()
            $("#otp-con").addClass("err")


        } if (newemail == "") {
            $("#mememail").show()
            $("#email-con").addClass("err")


        } if (confirmemail == "") {

            $("#mem-co-email").show()
            $("#confrimemail-con").addClass("err")


        } else {
            $("#memotp").hide()
            $("#mememail").hide()
            $("#mem-co-email").hide()
            $("#otp-con").removeClass("err")
            $("#email-con").removeClass("err")
            $("#confrimemail-con").removeClass("err")

            $.ajax({
                url: "/verify-otp",
                method: "POST",
                data: { "otp": otp, "newemail": newemail, "confirmemail": confirmemail },
                datatype: 'json',
                success: function (data) {
                    console.log(data);
                    var parse_data = JSON.parse(data)
                    console.log(parse_data.verify);
                    if (parse_data.verify == "invalid otp") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid otp'
                        $("#memotp").html(content)
                        $("#memotp").show()
                    } if (parse_data.verify == "otp exipred") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />otp exipred'
                        $("#memotp").html(content)
                        $("#memotp").show()
                    } if (parse_data.verify == "") {
                        window.location.href = "/myprofile"
                    }

                }
            })
        }
    })
})
