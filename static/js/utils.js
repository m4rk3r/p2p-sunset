jQuery.fn.exists = function(){return this.length>0;}

function randrange(a,b){
    /* returns a random number between >= a && <= b */
    low = Math.min(a,b); high = Math.max(a,b);
    return Math.floor(low + ((high-(low-1)) * Math.random()))
}

function map(x,a,b,c,d){
	return (x-a)/(b-a) * (d-c)+c;
}

function dateDecimal(d){
	return d.getHours() + d.getMinutes()/60 + d.getSeconds()/(60*60);
}

function randrangef(a,b){
    low = Math.min(a,b); high = Math.max(a,b);
    r = low + ((high-(low-1)) * Math.random())
    return  r > high ? high : r
}

function ColorArray(r,g,b){
    if(typeof(r) != 'undefined' && typeof(g) != 'undefined' && typeof(b) != 'undefined'){
        return new Array(r,g,b,1.0);
    }else{
        return new Array(randrange(0,255),randrange(0,255),randrange(0,255),1.0);    
    }
}

var x_factor = 0.2;
var y_factor = 3;

function sin(x){
	s = parseInt(Math.sin(x*x_factor)*y_factor);
    return s;
}

var x_factor2 = 0.5;
var y_factor2 = 20;
function sin2(x){
	s = parseInt(Math.sin(x*x_factor2)*y_factor2);
    return s;
}

function Color(r,g,b,a){ 
    r = (r == undefined ? 255 : r); 
    g = (g == undefined ? 255 : g);
    b = (b == undefined ? 255 : b);
    a = (a == undefined ? 255 : a);
    return 'rgba('+r+','+g+','+b+','+a+')';
}

function elapsedDay(sr,ss){
	return ((12 - ss) + (ss - 12));
}

function elapsedNight(sr,ss){
	return ((24 - ss) + (12 - sr));
}


function format(color){
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
}
function formatGS(color){
    var gs = parseInt((0.299*color[0] + 0.587*color[1] + 0.114*color[2]));
    return 'rgb('+gs+','+gs+','+gs+')';
}


function epoch(){
	return new Date().getTime()/1000;
}


/* default sunset */
var sunset_states = []

var fallback = [
    [ [104,139,242],[242,235,104]],
    [ [115,136,240],[237,228,99]],
    [ [91,104,240],[230,220,87]],
    [ [101,91,240],[232,220,84]],
    [ [114,91,240],[230,217,74]],
    [ [138,91,240],[232,218,65]],
    [ [156,91,240],[240,220,43]],
    [ [173,91,240],[240,201,43]],
    [ [185,91,240],[240,168,43]],
    [ [203,91,240],[247,169,35]],
    [ [228,91,240],[245,134,37]],
    [ [240,91,240],[245,122,39]],
    [ [240,91,218],[245,105,39]],
    [ [240,91,205],[245,87,39]],
    [ [240,91,181],[245,81,39]],
    [ [240,91,151],[245,63,39]],
    [ [240,56,132],[245,39,39]],
    [ [240,57,146],[235,50,50]],
    [ [240,57,167],[227,63,63]],
    [ [240,57,191],[224,72,72]],
    [ [240,57,219],[224,90,90]],
    [ [232,69,216],[230,106,106]],
    [ [245,90,232],[242,126,126]],
    [ [212,87,202],[230,129,129]],
    [ [173,90,167],[194,120,120]],
    [ [153,89,149],[179,86,86]],
    [ [122,85,120],[163,54,54]],
    [ [94,70,93],[148,35,35]],
    [ [64,49,63],[112,38,38]],
    [ [61,54,61],[87,36,36]],
    [ [48,36,48],[59,29,29]],
    [ [48,36,48],[48,30,30]]
]
// load new sunsets from server
$(function (){
    $.getJSON('/sunset/load-colors/',{id:SUN_IDX},function (data){
        sunset_states = data.data;
        timelength = data.length;
    }).error(function (){
        // fallback
        sunset_states = fallback;
        timelength = fallback.length;
    })
})
