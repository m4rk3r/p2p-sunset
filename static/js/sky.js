
//   sky,	  sun
// [ [0,0,0], [0,0,0 ]]
var max = Math.max;
var abs = Math.abs;
var floor = Math.floor;

function Sky(){
	this.init = function (){
        this.c = 0;
        this.c2 = 0;
		this.day = true;
        this.sun = [253, 255, 61];
        this.sky = [214, 255, 252];
		this.step_by = 1;
		this.state_ptr = [];
		this.c_epoch = epoch();
		this.c2_epoch = epoch();
		this.epochStep = 5;
        this.grayscale = false;
        this.it = 0;
        this.it2 = 0;
        this.thresh = 0;
        this.thresh2 = 0;
	}
	this.setPos = function (pos){
		this.pos = pos;
	}
    this.setEpochs = function (){
		this.c_epoch = epoch();
		this.c2_epoch = epoch();
    }
	this.resetCursors = function (){
		this.c = 0;
		this.c2 = 0;
	}
	this.calculate_steps = function ( elapsedtime ){
		var elapsedtime_s = elapsedtime * (60 * 60);
		this.epochStep = elapsedtime_s / this.state_ptr.length;

        var _in,_out,max_channel;
        
        _in = this.sky;
        _out = this.state_ptr[this.c][0];
        max_channel = max( abs(_out[0]-_in[0]), abs(_out[1]-_in[1]), abs(_out[2]-_in[2]) );
        this.thresh = floor(this.epochStep/max_channel);
        

        _in = this.sun;
        _out = this.state_ptr[this.c2][1];
        max_channel = max( abs(_out[0]-_in[0]), abs(_out[1]-_in[1]), abs(_out[2]-_in[2]) );
        this.thresh2 = floor(this.epochStep/max_channel);
        
        
        this.it = epoch();
        this.it2 = epoch();
	}
	this.step = function (){
        
        if( (epoch() - this.it) >= this.thresh ){
            this.it=epoch();
            if(this.sky[0] < this.state_ptr[this.c][0][0]) this.sky[0]+=this.step_by;
            else if(this.sky[0] > this.state_ptr[this.c][0][0]) this.sky[0]-=this.step_by;

            if(this.sky[1] < this.state_ptr[this.c][0][1]) this.sky[1]+=this.step_by;
            else if(this.sky[1] > this.state_ptr[this.c][0][1]) this.sky[1]-=this.step_by;
    
            if(this.sky[2] < this.state_ptr[this.c][0][2]) this.sky[2]+=this.step_by;
            else if(this.sky[2] > this.state_ptr[this.c][0][2]) this.sky[2]-=this.step_by;
        }
    
        if(((this.sky[0] >= this.state_ptr[this.c][0][0] - (this.step_by)) && (this.sky[0] <= this.state_ptr[this.c][0][0] + (this.step_by))) &&
           ((this.sky[1] >= this.state_ptr[this.c][0][1] - (this.step_by)) && (this.sky[1] <= this.state_ptr[this.c][0][1] + (this.step_by))) &&
           ((this.sky[2] >= this.state_ptr[this.c][0][2] - (this.step_by)) && (this.sky[2] <= this.state_ptr[this.c][0][2] + (this.step_by)))){
			if( (epoch() - this.c_epoch) >= this.epochStep && this.c < this.state_ptr.length-1){
                this.c++;
				this.c_epoch=epoch();
                
                var _in,_out,max_channel;
                _in = this.sky;
                _out = this.state_ptr[this.c][0];
                max_channel = max( abs(_out[0]-_in[0]), abs(_out[1]-_in[1]), abs(_out[2]-_in[2]) );
                this.thresh = floor(this.epochStep/max_channel);
                
                if(master){
                    window.sunset.socket.emit('tick',{peer: window.sunset.peer, step:this.c, epoch:this.c_epoch });
                }
            }
        }

        if( (epoch() - this.it2) >= this.thresh2 ){
            this.it2=epoch();
            if(this.sun[0] < this.state_ptr[this.c2][1][0]) this.sun[0]+=this.step_by;
            else if(this.sun[0] > this.state_ptr[this.c2][1][0]) this.sun[0]-=this.step_by;

            if(this.sun[1] < this.state_ptr[this.c2][1][1]) this.sun[1]+=this.step_by;
            else if(this.sun[1] > this.state_ptr[this.c2][1][1]) this.sun[1]-=this.step_by;
    
            if(this.sun[2] < this.state_ptr[this.c2][1][2]) this.sun[2]+=this.step_by;
            else if(this.sun[2] > this.state_ptr[this.c2][1][2]) this.sun[2]-=this.step_by;
        }
    
        if(((this.sun[0] >= this.state_ptr[this.c2][1][0] - (this.step_by)) && (this.sun[0] <= this.state_ptr[this.c2][1][0] + (this.step_by))) &&
           ((this.sun[1] >= this.state_ptr[this.c2][1][1] - (this.step_by)) && (this.sun[1] <= this.state_ptr[this.c2][1][1] + (this.step_by))) &&
           ((this.sun[2] >= this.state_ptr[this.c2][1][2] - (this.step_by)) && (this.sun[2] <= this.state_ptr[this.c2][1][2] + (this.step_by)))){
            //if(this.c2 < this.state_ptr.length-1){
			if( (epoch() - this.c2_epoch) >= this.epochStep && this.c2 < this.state_ptr.length-1){
                this.c2++;
				this.c2_epoch = epoch();
                
                var _in,_out,max_channel;
                _in = this.sun;
                _out = this.state_ptr[this.c2][1];
                max_channel = max( abs(_out[0]-_in[0]), abs(_out[1]-_in[1]), abs(_out[2]-_in[2]) );
                this.thresh2 = floor(this.epochStep/max_channel);
            }
        }    
	}
	this.draw = function (){
        if(this.grayscale) $('#sky').css({'background': '-webkit-radial-gradient(50% '+parseInt(this.pos)+'px, circle farthest-corner, '+formatGS(this.sun)+' 0%, '+formatGS(this.sky)+' 80%)'})
        else $('#sky').css({'background': '-webkit-radial-gradient(50% '+parseInt(this.pos)+'px, circle farthest-corner, '+format(this.sun)+' 0%, '+format(this.sky)+' 80%)'})
	}
}