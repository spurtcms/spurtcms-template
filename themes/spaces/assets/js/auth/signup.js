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
        "Please Enter at Least 1 Uppercase, 1 Lowercase, 1 Number,1 Special Character($,@),and 8 characters long"
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

    // $("form[name='signupform']").validate({

    //     ignore: [],
    //     rules: {

    //         firstname: {
    //             required: true,
    //             // fname_validator: true,
    //             space: true,
    //         },
    //         email: {
    //             required: true,
    //             email_validator: true,
    //             // duplicateemail:true
    //         },

    //         myNumber: {
    //             required: true,
    //             mob_validator: true,
    //             // duplicatenumber:true
    //         },
    //         password: {
    //             required: true,
    //             pass_validator: true

    //         }
    //     },
    //     messages: {
    //         firstname: {
    //             required: "Please Enter The First Name ",
    //             space: "No Prefix Space "
    //         },
    //         email: {
    //             required: "Please Enter The Email Address",
    //             // duplicateemail:" "
    //         },
    //         myNumber: {
    //             required: " Please Enter The Mobile Number "
    //         },
    //         password: {
    //             required: "Please Enter The Password "
    //         },


    //     }
    // })

})




// $(document).on("click", "#create-btn", function () {
   
//     var formcheck = $("form[name ='signupform']").valid()
    
//     if (formcheck == true) {

//         $('.spinner-border').show();

//         $('#create-btn').attr('disabled',true);

//         $("form[name ='signupform']").submit()

//     } else {

//         $(document).on('keyup', ".field", function () {
//             Validationcheck()
//         })
//         $('.ig-row').each(function () {
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
$(document).on('click',"#create-btn",function () {


    jQuery.validator.addMethod("duplicateemail", function (value) {

        var result;
        var mem_id = $("#mem_id").val()

        $.ajax({
            url: "/spaces/checkemailinmember",
            type: "POST",
            async: false,
            data: { "email": value, "id": mem_id },
            datatype: "json",
            caches: false,
            success: function (data) {
                result = data.trim();

            }
        })
        return result.trim() != "true"
    })

    jQuery.validator.addMethod("duplicatenumber", function (value) {

        var result;
        var mem_id = $("#mem_id").val()

        $.ajax({
            url: "/spaces/checknumberinmember",
            type: "POST",
            async: false,
            data: { "number": value, "id": mem_id },
            datatype: "json",
            caches: false,
            success: function (data) {
                console.log(data,"ckkkkk")
                result = data.trim();

            }
        })
        return result.trim() != "true"
    })

    jQuery.validator.addMethod("duplicatename", function (value) {

        var result;
        var mem_id = $("#mem_id").val()

        $.ajax({
            url: "/spaces/checknameinmember",
            type: "POST",
            async: false,
            data: { "name": value, "id": mem_id },
            datatype: "json",
            caches: false,
            success: function (data) {
                result = data.trim();

            }
        })
        return result.trim() != "true"
    })

    $.validator.addMethod("mob_validator", function (value) {
        if (/^[6-9]{1}[0-9]{9}$/.test(value))
            return true;
        else return false;
    }, "*Please Enter valid mobile number" );

    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '*  Please Enter The Valid Email Address ' );

    jQuery.validator.addMethod("pass_validator", function (value, element) {
        if (value != "") {
            if (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/.test(value))
                return true;
            else return false;
        }
        else return true;
    }, "*  Please Enter at Least 1 Uppercase, 1 Lowercase, 1 Number,1 Special Character($,@),and 8 characters long"
    );

    $.validator.addMethod("space", function (value) {
        return /^[^-\s]/.test(value);
    });

    // Form Validation

    $("form[name='signupform']").validate({

        ignore: [],
        rules: {
         
            fname: {
                required: true,
                space: true
            },
          
            email: {
                required: true,
                email_validator: true,
                duplicateemail: true
            },
            
            username: {
                required: true,
                space: true,
                duplicatename: true
            },
            password: {
                required: true,
                pass_validator: true,
            },
            mobile: {
                required: true,
                mob_validator: true,
                duplicatenumber: true
                

            },
          

        },
        messages: {
          
            fname: {
                required: "*Please Enter The First Name " ,
                space: "*No Space Prefix " 
            },
          
            email: {
                required: "* Please Enter the Email",
                duplicateemail: "* Email Already Exists" 
            },
            
            username: {
                required: "* Please Enter the Username",
                space: "* No Space Prefix" ,
                duplicatename: "*Username Already Exists" 
            },
            password: {
                required: "* Please Enter the Password" 
            },
            mobile: {
                required: "* Please Enter the Mobile Number" ,
                duplicatenumber: "* Mobile Number Already Exists" 
            },
            
        }
    })

    var formcheck = $("#signupform").valid();
    if (formcheck == true) {

        $('#signupform')[0].submit();
    }
    else {

        $(document).on('keyup', ".field", function () {
        
            let inputGro = document.querySelectorAll('.ig-row');
            inputGro.forEach(inputGroup => {
                let inputField = inputGroup.querySelector('input');
                console.log(inputField,"input")
                var inputName = inputField.getAttribute('name');
        
                if (inputField.classList.contains('error')) {
        
                    console.log("error1")
                    inputGroup.classList.add('err');
                } else {
                    inputGroup.classList.remove('err');
                }
              
            });
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

    return false
})




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