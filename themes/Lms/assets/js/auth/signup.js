/* Register Form validation */
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

    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '* Please Enter The Valid Email Address ');

    jQuery.validator.addMethod("mob_validator", function (value, element) {
        return /^([0|\+[0-9]{1,5})?([7-9]{1}[0-9]{9})$/.test(value)
    }, "Started With Country code");


    $.validator.addMethod("space", function (value) {
        return /^[^-\s]/.test(value);
    });


    // jQuery.validator.addMethod("duplicateemail", function (value) {

    //     var result;
    //     user_id = $("#userid").val()
    //     $.ajax({
    //         url:"/settings/users/checkemail",
    //         type:"POST",
    //         async:false,
    //         data:{"email":value,"id":user_id,csrf:$("input[name='csrf']").val()},
    //         datatype:"json",
    //         caches:false,
    //         success: function (data) {
    //             result = data.trim();
    //         }
    //     })
    //     return result.trim()!="true"
    // })

    // jQuery.validator.addMethod("duplicateusername", function (value) {

    //     var result;
    //     user_id = $("#userid").val()
    //     $.ajax({
    //         url:"/settings/users/checkusername",
    //         type:"POST",
    //         async:false,
    //         data:{"username":value,"id":user_id,csrf:$("input[name='csrf']").val()},
    //         datatype:"json",
    //         caches:false,
    //         success: function (data) {
    //             result = data.trim();
    //         }
    //     })
    //     return result.trim()!="true"
    // })

    // jQuery.validator.addMethod("duplicatenumber", function (value) {

    //     var result;
    //     user_id = $("#userid").val()
    //     $.ajax({
    //         url:"/settings/users/checknumber",
    //         type:"POST",
    //         async:false,
    //         data:{"number":value,"id":user_id,csrf:$("input[name='csrf']").val() },
    //         datatype:"json",
    //         caches:false,
    //         success: function (data) {
    //             result = data.trim();
    //         }
    //     })
    //     return result.trim()!="true"
    // })

    // Password Change
    $(document).on('click', '#pass-con', function () {

        var This = $("#password")

        if ($(This).attr('type') === 'password') {

            $(This).attr('type', 'text');

            $(this).removeClass('fa-eye-slash').addClass('fa-eye')

        } else {

            $(This).attr('type', 'password');

            $(this).removeClass('fa-eye').addClass('fa-eye-slash')
        }
    })

    $("form[name='signupform']").validate({

        ignore: [],
        rules: {

            firstname: {
                required: true,
                // fname_validator: true,
                space: true,
            },
            email: {
                required: true,
                email_validator: true,
                // duplicateemail:true
            },

            myNumber: {
                required: true,
                mob_validator: true,
                // duplicatenumber:true
            },
            myPassword: {
                required: true,
                pass_validator: true

            }
        },
        messages: {
            firstname: {
                required: "Please Enter The First Name ",
                space: "No Prefix Space "
            },
            email: {
                required: "Please Enter The Email Address",
                // duplicateemail:" "
            },
            myNumber: {
                required: " Please Enter The Mobile Number "
            },
            myPassword: {
                required: "Please Enter The Password ",
            },


        }
    })

})




$(document).on("click", "#create-btn", function () {
   
    var formcheck = $("form[name ='signupform']").valid()
    
    if (formcheck == true) {

        $('.spinner-border').show();

        $('#create-btn').attr('disabled',true);

        $("form[name ='signupform']").submit()

    } else {

        $(document).on('keyup', ".field", function () {
            Validationcheck()
        })
        $('.ig-row').each(function () {
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
    $('.ig-row').each(function () {
        var inputField = $(this).find('input');
        var inputName = inputField.attr('name');

        if (!inputField.valid()) {
            $(this).addClass("err");

        } else {
            $(this).removeClass("err")
        }
    })
})

function Validationcheck() {
    let inputGro = document.querySelectorAll('.ig-row');
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


var Cookie = getCookie("Error");

if (Cookie == "email+already+exists+cannot+register") {
    
    var content = 'Email Already Exists'

    $("#email-error").html(content)

    $("#email-error").show()

    $('#email-error').parent('.ig-row').addClass('err')
    
    delete_cookie("Error")

} else if (Cookie == "mobile+no+already+exists+cannot+register") {
    
    var content = 'Mobileno Already Exists'
    
    $("#myNumber-error").html(content)
    
    $("#myNumber-error").show()

    $('#myNumber-error').parent('.ig-row').addClass('err')
    
    delete_cookie("Error")
}

$('#myNumber').keyup(function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});

// Password Change
$(document).on('click', '#rpswdeye', function () {

    var This = $("#myPassword")

    if ($(This).attr('type') === 'password') {

        $(This).attr('type', 'text');

        $(this).addClass('active')

    } else {

        $(This).attr('type', 'password');

        $(this).removeClass('active')

    }
})