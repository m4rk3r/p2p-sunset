var useless_ornament = [];
var endless_summer = false;
var SUN_IDX=0;

$(function (){
     $('.popbox').popbox();

    var counter = 0;
    var increase = Math.PI * 2 / 150;
     var it = setInterval(function (){
          y = Math.sin( counter ) / 2 + 5;
          counter += increase;
          y = parseInt(y * 20);

         $('#message-box').css({'margin-top':y });
     },20);
     useless_ornament.push(it);
});

function build_invite(){
    $.get('invite/',{'user':window.user}, function ( data ){
        var link = 'https://duskjacket.com/sunset/?sunset='+data;
        $("#link-value").val(link);

        $("#link-value").fadeIn();
        $("#link-value").focus();
        $("#link-value").select();
    });
}
