
function Sun(){
    this.init = function(){
        this.r = 110;
        this.origin = {'x':window.innerWidth/2-11, 'y':-11};
        $('#sun').css({'top':this.pos})
        this.s = 15;
        this.dec = 0;
        this.steps = 50; 
		this.height = 240;
        this.pos = window.innerHeight+this.height;        
		this.sunrise_sunset = false;
        /*
        for(j=this.r; j > this.r-400; j-=this.s){
           for(i=0; i < this.steps; i++){
               var pr = i / this.steps;
               var stepX = Math.cos(pr * 2 * Math.PI);
               var stepY = Math.sin(pr * 2 * Math.PI);
   
               var x = this.origin.x + stepX * j;
               var y = this.origin.y + stepY * j;
    
               $("<input type='radio' class='node' checked  />").css({left:x,top:y}).appendTo('#sun');  
           }
           this.steps -= 7;
        }
		$($('#sun > .node').last()).css({'left':"-=4"})		
		*/
    }
	this.setPos = function(pos){
		this.pos = pos;
	}
    
    this.draw = function(){     
        $("#sun").css({'top':this.pos});
    }
}
