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
/* Resend Otp */
$(document).on("click", "#againotp1", function () {

    var url = window.location.search;
    const urlpar = new URLSearchParams(url);
    email = urlpar.get('emailid');


    $.ajax({
        url: "/send-otp-genrate1",
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