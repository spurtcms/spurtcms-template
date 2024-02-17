
/* Myprofile Form validation */
$(document).ready(function () {

    $.validator.addMethod("mobilenum", function (value) {
        return /^[6-9]{1}[0-9]{9}$/.test(value);
    }, "Mobile number must contain 10 digits and starts from number 6 to 9 only");

    // only allow numbers
    $('#mobileNumber').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    $("form[name='myprofileform']").validate({

        rules: {
            firstname: {
                required: true
            },
            // lastname: {
            //     required: true,
            // },
            mobileNumber: {
                required: true,
                mobilenum: true
            }
        },
        messages: {
            firstname: {
                required: "Please Enter Your The First Name "
            },
            // lastname: {
            //     required: " Please Enter Your The Last Name " ,
            // },
            mobileNumber: {
                required: " Please Enter Your Mobile Number",

            }
        }


    })



})


$(document).on("click", "#update-btn", function () {

    var formcheck = $("form[name ='myprofileform']").valid()

    var fname = $("#firstname").val()
    var lname = $("#lastname").val()
    var mobile = $("#mobileNumber").val()
    var crop_data = $("#crop_data").val()

    if (formcheck == true) {

        $("form[name ='myprofileform']").submit()

    } else {

        $(document).on('keyup', ".field", function () {
            Validationcheck()
        })
        $('.input-container').each(function () {
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

function Validationcheck() {
    let inputGro = document.querySelectorAll('.input-container');
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



/* Myprofile Cancel */
$(document).on("click", "#cancel-btn", function () {
    window.location.href = "/"
})

$(document).on('click', '.btn-close', function () {
    console.log("check")
    $("#changepicModal").modal('hide');
})