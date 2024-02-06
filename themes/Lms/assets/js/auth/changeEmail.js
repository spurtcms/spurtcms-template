$(document).ready(function () {

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

// $(document).on("click", "#changeemailsubmit", function () {

//     var formcheck = $("form[name ='changeemail']").valid()

//     var url = window.location.search;
//     const urlpar = new URLSearchParams(url);
//     oldemailid = urlpar.get('changeemail');
//     var otp = $("#otp").val()
//     var newemail = $("#emailaddress").val()
//     var confirmemail = $("#confirmemail").val()
//     console.log("ss", newemail, confirmemail, otp);
//     if (formcheck == true) {
//         $.ajax({
//             url: "/verify-email-otp",
//             method: "POST",
//             data: { "otp": otp, "newemail": newemail, "confirmemail": confirmemail, "oldemailid": oldemailid },
//             datatype: 'json',
//             success: function (data) {
//                 console.log(data);
//                 console.log(data.verify);
//                 if (data.verify == "Otp Required") {
//                     var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Otp Required'
//                     $("#otp-error").html(content)
//                     $("#otp-error").show()
//                 } if (data.verify == "Email Required") {
//                     var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />Email Required'
//                     $("#emailaddress-error").html(content)
//                     $("#emailaddress-error").show()
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

            if (data.verify == true) {

                $.toast({
                    text: "otp sended successfully", // Text that is to be shown in the toast
                    heading: 'Note', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values



                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: true,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
            } else {

                $.toast({
                    text: data.verify, // Text that is to be shown in the toast
                    heading: 'Note', // Optional heading to be shown on the toast
                    icon: 'warning', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values



                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: true,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
            }



        }
    })


})