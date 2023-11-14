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

    jQuery.validator.addMethod("mob_validator",function (value, element) {
            return /^([0|\+[0-9]{1,5})?([7-9]{1}[0-9]{9})$/.test(value)
        },"Started With Country code");
    

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
   
    ignore:[],
    rules: {
       
        firstname: {
            required: true,
            // fname_validator: true,
            space: true,
        },
        lastname: {
            required: true,
            // lname_validator: true,
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
            pass_validator:true
            
        }
    },
    messages: {
        firstname: {
            required: "Please Enter The First Name ",
            space: "No Prefix Space " 
        },
        lastname: {
            required: "Please Enter Your Last Name ",
            space: "No Prefix Space " 
        },
        email: {
            required: "Please Enter The Email Address",
            // duplicateemail:" "
        },
        myNumber: {
            required: " Please Enter The Mobile NUmber "
        },
        myPassword: {
            required: "Please Enter The Password " ,
        },
          
      
    }
})
    
})




$(document).on("click", "#create-btn", function () {
    var formcheck = $("form[name ='signupform']").valid()

    var fname = $("#firstname").val()
    var lname = $("#lastname").val()
    var mobile = $("#myInput").val()
    var email = $("#email").val()
    var password = $("#myPassword").val()

    // console.log("pass", password);
    // console.log(fname == "" && lname == "" && mobile == "" && email == "" && password == "");
    // if (fname == "" && mobile == "" && email == "" && password == "") {
    //     $("#memfname").show()
    //     $("#fname-con").addClass("err")
    //     $("#memnumber").show()
    //     $("#mobile-con").addClass("err")
    //     $("#mememail").show()
    //     $("#email-con").addClass("err")
    //     $("#mempass").show()
    //     $("#pass-con").addClass("err")

    // } if (fname == "") {
    //     $("#memfname").show()
    //     $("#fname-con").addClass("err")
    // } if (mobile == "") {
    //     $("#memnumber").show()
    //     $("#mobile-con").addClass("err")
    // } if (email == "") {
    //     $("#mememail").show()
    //     $("#email-con").addClass("err")

    // } if (password == "") {
    //     $("#mempass").show()
    //     $("#pass-con").addClass("err")
    // } else {
    //     $("#memfname").hide()
    //     $("#memnumber").hide()
    //     $("#mememail").hide()
    //     $("#mempass").hide()
    //     $("#fname-con").addClass("err")
    //     $("#mobile-con").addClass("err")
    //     $("#email-con").addClass("err")
    //     $("#pass-con").removeClass("err")

    if (formcheck == true) {

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
      
        if (inputField.classList.contains('error')) {
            inputGroup.classList.add('err');
        } else {
            inputGroup.classList.remove('err');
        }
      
    });
}