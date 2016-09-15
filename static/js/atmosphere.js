var data = '';
var sunset  = ''//new Date( data.average.sunset+'Z' );
		
var sun,sky,begin,end,begin_d,end_d;		
var sunsetd = 0;//dateDecimal(sunset);
var advance = 0;
var first = true;
var timelength = 10;
var DEBUG = false;

function gotoGrayScale(){
    $('.messages').each(function (){
        $(this).remove();
    })
    for(var i =0; i < useless_ornament.length; i++){
        clearInterval( useless_ornament[i] );
    }
    sky.grayscale = true;
    $('#sky').append('<div class="warning" id="message-box"><a href="/SUNSET/" class="end">(lost connection to peer)</a></div>')
	var counter = 0;
	var increase = Math.PI * 2 / 150;
     var it = setInterval(function (){         
		  y = Math.sin( counter ) / 2 + 5;
		  counter += increase;
		  y = parseInt(y * 20);
			  
         $('#message-box').css({'margin-top':y });
     },20);
     sky.draw();
     
     if(endless_summer)setTimeout(function (){ window.location.reload()}, 5000);
}
				
$(function (){
	// run
	sun = new Sun();
	sun.init();
									
	sky = new Sky();
	sky.init(); 
    sky.setPos( window.innerHeight-sun.height*2 )   
    sky.draw();
    
	$(document).keypress(function (e){
	    var code = (e.keyCode ? e.keyCode : e.which);
        if(code==100){
		    if($('#debug').is(":visible")){
                $('#debug').css({'display':'none'})
                DEBUG = false;
            }else{
                $('#debug').css({'display':'inline'})
                DEBUG = true;
		    }
	    }
	})
});
                
function make_sunset(){	
    // remove gui
    $('.messages').each(function (){
        $(this).remove();
    })
    for(var i =0; i < useless_ornament.length; i++){
        clearInterval( useless_ornament[i] );
    }
    
    begin = new Date(new Date());
    end = new Date(new Date().setMinutes(begin.getMinutes()+timelength)) ;
    begin_d = dateDecimal(begin); 
    end_d = dateDecimal( end );
    
    //sky.setEpochs(); // good to keep off while testing :P
	sky.state_ptr = sunset_states;
	//sky.sky = sunset_states[0][0];
	//sky.sun = sunset_states[0][1];
	sky.calculate_steps( end_d - begin_d );
    
	var interval = setInterval(function (){
		now = new Date(new Date());
        var now_d = dateDecimal(now)

        if(DEBUG){
    		$("#debug").html('begin: '+ begin+'<BR>\
                             end: '+ end +'<BR>\
    						time remaining: '+(now > end?'0:00':parseInt((dateDecimal(end) - dateDecimal(now)) * 60)+':'+(60 - (now.getSeconds())))+'<BR>\
    						pos: '+sky.pos+'<BR>\
                            c_epoch: '+parseInt(epoch() - sky.c_epoch)+' c2_epoch: '+parseInt(epoch() - sky.c2_epoch)+' thrsh: '+ parseInt(sky.epochStep)+'<BR>\
                            c:' +sky.c + ' c2: '+sky.c2
    					    )	
        }

        if(now > end){
            clearInterval(interval);
            if(endless_summer)setTimeout(function (){ window.location.reload()}, 5000);
        } 
        var pos = map(now_d,begin_d,end_d,window.innerHeight-sun.height*2,window.innerHeight+sun.height*2);
	    sky.setPos( pos );																
        sky.step();
        sky.draw();
	},300)
}