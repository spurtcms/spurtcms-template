
/* Login validation */
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
        "* Please Enter at Least 1 Uppercase, 1 Lowercase, 1 Number,1 Special Character($,@),and 8 characters long"
    );


    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '* Please Enter The Valid Email Address ');

        $("form[name='loginform']").validate({
            rules: {
                email: {
                    required: true,
                    email_validator:true
                   
                },
                password: {
                    required: true,
                    pass_validator: true

                }
            },
            messages: {
                email: {
                    required: " Please Enter Your Email Address" ,
                },
                password: {
                    required: " Please Enter Your Password ",

                }
    
            }
        });


      

        // $("#mememail").hide()
        // $("#mempass").hide()
        // $("#email-con").removeClass("err")
        // $("#pass-con").removeClass("err")
       
        // var email = $("#myInput").val()
        // var password = $("#myPassword").val()
        // if (email == "" && password == "") {
        //     $("#mememail").show()
        //     $("#email-con").addClass("err")
        //     $("#mempass").show()
        //     $("#pass-con").addClass("err")

        // } if (email == "") {
        //     $("#mememail").show()
        //     $("#email-con").addClass("err")

        // } if (password == "") {
        //     $("#mempass").show()
        //     $("#pass-con").addClass("err")
        // } else {
        //     $("#mememail").hide()
        //     $("#mempass").hide()
        //     $("#email-con").removeClass("err")
        //     $("#pass-con").removeClass("err")

        //     $.ajax({
        //         url: "/checkmemberlogin",
        //         method: "POST",
        //         data: { "email": email, "password": password },
        //         datatype: 'json',
        //         success: function (data) {
        //             console.log(data);
        //             var parse_data = JSON.parse(data)
        //             console.log(parse_data.verify);
        //             if (parse_data.verify == "your email not registered") {
        //                 var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />your email not registered'
        //                 $("#mememail").html(content)
        //                 $("#mememail").show()
        //             } if (parse_data.verify == "invalid password") {
        //                 var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid password'
        //                 $("#mempass").html(content)
        //                 $("#mempass").show()
        //             } if (parse_data.verify == "") {
        //                 window.location.href = "/"
        //             }

        //         }
        //     })
        // }
    // })
  
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



 
$(document).on("click", "#submit", function () {

var formcheck = $("form[name ='loginform']").valid()

       var email = $("#myInput").val()
        var password = $("#myPassword").val()

        if (formcheck == true) {
            $.ajax({
                url: "/checkmemberlogin",
                method: "POST",
                data: { "email": email, "password": password },
                datatype: 'json',
                success: function (data) {
                    console.log(data);
                    var parse_data = JSON.parse(data)
                    console.log(parse_data.verify);
                    if (parse_data.verify == "your email not registered") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />your email not registered'
                        $("#myInput-error").html(content)
                        $("#myInput-error").show()
                    } if (parse_data.verify == "invalid password") {
                        var content = '<img src="/public/images/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid password'
                        $("#myPassword-error").html(content)
                        $("#myPassword-error").show()
                    }
                    
                    if (parse_data.verify == "") {
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