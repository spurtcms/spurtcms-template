
/* Register Form validation */
$(document).ready(function () {
    $(document).on("click", "#create-btn", function () {
        console.log("egrgdggeg");
        var fname = $("#firstname").val()
        console.log("fname", fname);
        var lname = $("#lastname").val()
        var mobile = $("#myInput").val()
        var email = $("#email").val()
        var password = $("#myPassword").val()
        console.log("pass", password);
        console.log(fname == "" && lname == "" && mobile == "" && email == "" && password == "");
        if (fname == "" && mobile == "" && email == "" && password == "") {
            $("#memfname").show()
            $("#fname-con").addClass("err")
            $("#memnumber").show()
            $("#mobile-con").addClass("err")
            $("#mememail").show()
            $("#email-con").addClass("err")
            $("#mempass").show()
            $("#pass-con").addClass("err")

        } if (fname == "") {
            $("#memfname").show()
            $("#fname-con").addClass("err")
        } if (mobile == "") {
            $("#memnumber").show()
            $("#mobile-con").addClass("err")
        } if (email == "") {
            $("#mememail").show()
            $("#email-con").addClass("err")

        } if (password == "") {
            $("#mempass").show()
            $("#pass-con").addClass("err")
        } else {
            $("#memfname").hide()
            $("#memnumber").hide()
            $("#mememail").hide()
            $("#mempass").hide()
            $("#fname-con").addClass("err")
            $("#mobile-con").addClass("err")
            $("#email-con").addClass("err")
            $("#pass-con").removeClass("err")
            $.ajax({
                url: "/memberregister",
                method: "POST",
                data: { "fname": fname, "lname": lname, "mobile": mobile, "email": email, "password": password },
                datatype: 'json',
                success: function (data) {
                    console.log("data", data);
                    if (data) {
                        window.location.href = "/"
                    }

                }
            })
        }
    })
})