/**
 * 
 * 
 */

function click(url){
	var x;
	var r=confirm("Are you sure delete!");
	if (r==true)
	  {
		window.location.href = url;
	  }
}
$(document).ready(function() {
    $('#refreshcaptcha').click(function() { 
        $.ajax({ 
            url: '/montsame/public/autentication/refresh', 
            dataType:'json', 
            success: function(data) { 
                $('#register img').attr('src', data.src); 
                $('#captcha-id').attr('value', data.id); 
            }
        }); 
    }); 
});