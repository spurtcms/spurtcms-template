$(document).ready(function () {

    let cropper = $('#crop-container').croppie({
        enableExif: true,
        enableResize: false,
        enableOrientation: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        boundary: {
            width: 300,
            height: 300
        },
        showZoomer: false,
        // fit:true,
    });
    var imgurl, img, canvas, ctx

    // Image Value Empty
    $("#myfile,#file").click(function () {
        $(this).val("")
    })

    // Change Image with cropper
    $("#myfile,#file").change(function () {
        var file = this.files[0];
        var filename = $(this).val();
        var ext = filename.split(".").pop().toLowerCase();
        if (($.inArray(ext, ["jpg", "png", "jpeg"]) != -1)) {
            var reader = new FileReader();
            reader.onload = function (event) {
                imgurl = event.target.result
                img = new Image()
                img.src = imgurl
            }
            reader.readAsDataURL(file);
            $('#changepicModal').modal('show');
        }
    });

    $('#changepicModal').on('shown.bs.modal', function (event) {
        $('canvas[class=cr-image]').css('opacity', '0')
        $('.cr-slider-wrap').appendTo($('#zoom-div'));
        $('.cr-slider').css('display', 'block')
        canvas = document.querySelector('canvas[class=cr-image]');
        ctx = canvas.getContext('2d');
        cropper.croppie('bind', {
            url: imgurl
        }).then(function () {
            cropper.croppie('setZoom', 0.2)
            console.log("cropper initialized!");
        })
    });

    $('#rotateSlider').on('input', function () {
        var rotationValue = parseInt($(this).val());
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotationValue * Math.PI) / 180);
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
        ctx.restore()
    });

    $('#crop-button').click(function () {
        cropper.croppie('result', { type: 'base64', size: 'viewport', format: 'jpeg', circle: true, }).then(function (dataUrl) {
            $('#profpic').attr('src', dataUrl)
            $('input[name=crop_data]').attr('value', dataUrl)
            $('canvas[class=cr-image]').css('opacity', '0')
            $("#changepicModal").modal('hide');
        });
    });

    $('#close,#crop-cancel').click(function () {

        $("#changepicModal").modal('hide');
        $('canvas[class=cr-image]').css('opacity', '0')

    });

    $('#changepicModal').on('hide.bs.modal', function (event) {
        $('canvas[class=cr-image]').css('opacity', '0')
    })
})


function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function delete_cookie(name) {
    console.log(name);
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//alert messages
document.addEventListener("DOMContentLoaded", async function () {

    var Cookie = getCookie("Success");
    var content = Cookie.replaceAll("+", " ")
    var msg = getCookie("Error");


    if (Cookie != '') {

        $.toast({
            text: content, // Text that is to be shown in the toast
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
            beforeShow: function () {}, // will be triggered before the toast is shown
            afterShown: function () {}, // will be triggered after the toat has been shown
            beforeHide: function () {}, // will be triggered before the toast gets hidden
            afterHidden: function () {}  // will be triggered after the toast has been hidden
        });


    } else if (msg != '') {

        console.log(msg);
        var content = msg.replaceAll("+", " ")

        $.toast({
            text: content, // Text that is to be shown in the toast
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
            beforeShow: function () {}, // will be triggered before the toast is shown
            afterShown: function () {}, // will be triggered after the toat has been shown
            beforeHide: function () {}, // will be triggered before the toast gets hidden
            afterHidden: function () {}  // will be triggered after the toast has been hidden
        });

    }

    delete_cookie("Success");
    delete_cookie("Error");

})