/* Forget Pswd otp form */
$(document).ready(function () {

    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '* Please Enter The Valid Email Address ');

    $("form[name='forgetform']").validate({
        rules: {
            email: {
                required: true,
                email_validator: true
            }
        },
            messages: {
                email: {
                    required: " Please Enter Your Email Address",
                }
            }
        
    })

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