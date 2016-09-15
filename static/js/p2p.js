var master = false;

function querystring() {
   var re=new RegExp('(?:\\?|&)(.*?)=(.*?)(?=&|$)','gi');
   var r={}, m;
   while ((m=re.exec(document.location.search)) != null) r[m[1]]=m[2];
   return r;
}

(function (){
    SunsetManager = Backbone.View.extend({
        'DEBUG':true,
        'unitary':false,
        initialize: function (){
            _.bindAll(this,'update');

            if(this.DEBUG) console.log('connecting');

            this.socket = io.connect('http://localhost:8075');

            this.socket.on('connect', _.bind(function () {
                console.log('connected');
                qs = querystring();

                if(qs.sunset)
                    this.socket.emit('subscribe',{sunset:qs.sunset});
                else
                    this.socket.emit('enter',{user:window.user});

                if(document.location.search=='?endless'){
                    endless_summer=true;
                    $('#message-box2').remove();
                }
            },this));

            this.socket.on('error', function (e) {
                console.log('System', e ? e : 'A unknown error occurred');
            });

            this.socket.on('disconnect', _.bind(function (e){
                if(this.DEBUG)console.log('disconnected');
                gotoGrayScale();
            },this));

            this.socket.on('message', _.bind(function (msg){
                if(this.DEBUG)console.log(msg.message);
            },this));

            this.socket.on('update', _.bind(function (obj){
                if(this.DEBUG)console.log('update:' +obj);
                o = obj;
                this.update(obj);
            },this));

            this.socket.on('wait',function (msg){
                console.log('waiting')
            })

            if(!this.unitary){
                window.onbeforeunload = _.bind(function(e) {
                    this.socket.emit('exit', {user:window.user});
                },this);
            }

        },

        update: function (data){
            switch(data.action){
                case 'start':
                    make_sunset();
                    this.peer = data.peer;
                    master=data.master;
                    SUN_IDX = data.sun_idx;
                    break;
                case 'tick':
                    if(sky.c != data.step){
                        // asign peer's values to catch us up
                        /*console.log('get index: '+data.step+' & we are: '+sky.c)
                        console.log('out of step, catching up!')*/
                        sky.c = data.step; sky.c2 = data.step;
                        sky.c_epoch = data.epoch; sky.c2_epoch = data.epoch;
                    }
                    break;
                case 'exit':
                    gotoGrayScale();
                    break;
            }
        },
    })


    $(function() {
        window.sunset = new SunsetManager();
    });
})();