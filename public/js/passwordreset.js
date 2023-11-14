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


    $.validator.addMethod("otp_validator", function (value) {
        return /(^[0-9]\g){1,6}$/.test(value);
    }, '* Please Enter 6 Digit Number ');

        $("form[name='changepasswordform']").validate({
            rules: {
                otp:{
                required:true,
                otp_validator :true
                },
                mynewPassword: {
                    required: true,
                    pass_validator:true                   
                },
                confrimPassword: {
                    required: true,
                    equalTo: "#mynewPassword"
                }
            },
            messages: {
                otp:{
                    required:"Please Enter The Otp "
                },
                mynewPassword: {
                    required: " Please Enter Your New Password" ,
                },
                confrimPassword: {
                    required: " Please Re-Enter Your New Password ",
                    equalTo:" Please Enter The Same New Password"
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

$(document).on("click", "#submit", function () {

    var formcheck = $("form[name ='changepasswordform']").valid()

    var otp = $("#otp").val()
    var newpassword = $("#mynewPassword").val()
    var confirmpassword = $("#confrimPassword").val()
    if (formcheck == true) {
        $.ajax({
            url: "/verify-otp",
            method: "POST",
            data: { "otp": otp, "newpassword": newpassword, "confirmpassword": confirmpassword },
            datatype: 'json',
            success: function (data) {
                console.log(data);
                var parse_data = JSON.parse(data)
                console.log(parse_data.verify);
                if (parse_data.verify == "invalid otp") {
                    var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid otp'
                    $("#otp-error").html(content)
                    $("#otp-error").show()
                } if (parse_data.verify == "otp exipred") {
                    var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />otp exipred'
                    $("#otp-error").html(content)
                    $("#otp-error").show()
                } if (parse_data.verify == "") {
                    window.location.href = "/myprofile"
                }
        
            }
        })

        
    }else{

        $(document).on('keyup',".field",function(){
            Validationcheck()
        })
       $('.input-container').each(function() {
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

function Validationcheck(){
    let inputGro = document.querySelectorAll('.input-container');
    inputGro.forEach(inputGroup => {
        let inputField = inputGroup.querySelector('input');
        var inputName = inputField.getAttribute('name');
        console.log("input",inputName)
      
        if (inputField.classList.contains('error')) {
            inputGroup.classList.add('err');
        } else {
            inputGroup.classList.remove('err');
        }
      
    });
}