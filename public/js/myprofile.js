
/* Myprofile Form validation */
$(document).ready(function () {
    $(document).on("click", "#update-btn", function () {
        var fname = $("#firstname").val()
        var lname = $("#lastname").val()
        var mobile = $("#mobileNumber").val()
        console.log("myprofile data", fname, lname, mobile);
        if (fname == "" && mobile == "") {
            $("#memfname").show()
            $("#fname-con").addClass("err")
            $("#memnumber").show()
            $("#mobile-con").addClass("err")
        } if (fname == "") {
            $("#memfname").show()
            $("#fname-con").addClass("err")
        } if (mobile == "") {
            $("#memnumber").show()
            $("#mobile-con").addClass("err")
        } else {
            $("#memfname").hide()
            $("#memnumber").hide()
            $("#fname-con").addClass("err")
            $("#mobile-con").addClass("err")
            $.ajax({
                url: "/myprofileupdate",
                method: "POST",
                data: { "fname": fname, "lname": lname, "mobile": mobile },
                datatype: 'json',
                success: function (data) {
                    console.log("data", data);
                    if (data) {
                        window.location.href = "/myprofile"
                    }

                }
            })
        }
    })
})

/* Myprofile Cancel */

$(document).on("click", "#cancel-btn", function () {
    window.location.href = "/index"
})