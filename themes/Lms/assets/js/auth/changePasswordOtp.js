/* ChangeEmail validation */

$(document).ready(function () {

    $.validator.addMethod("email_validator", function (value) {
        return /(^[a-zA-Z_0-9\.-]+)@([a-z]+)\.([a-z]+)(\.[a-z]+)?$/.test(value);
    }, '* Please Enter The Valid Email Address ');

    $("#psdotpform").validate({
        rules: {
            email: {
                required: true,
                email_validator:true                   
            }
        },

            messages: {             
                email: {
                    required: " Please Enter Your Old Email Address"
                }
            }
        
    })


})


$(document).on("click", "#changepasssotpsubmit", function () {

   var formcheck = $("#psdotpform").valid()

   var email = $("#oldemail").val()

   if (formcheck == true){

    $.ajax({
        url: "/otp-genrate",
        method: "POST",
        data: { "email": email },
        datatype: 'json',
        success: function (data) {
            console.log("ok",data.verify);
            if (data.verify == "invalid email") {
                var content = '<img src="/static/icons/Icon ionic-ios-close-circle.svg" class="m-0" alt="" />invalid email'
                $("#oldemail-error").html(content)
                $("#oldemail-error").show()
            } if (data.verify == "") {
                window.location.href = "/passwordchange?emailid="+email
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