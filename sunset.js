var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

server.listen(8075, function (){
    console.log('listening on port 8075');
});

var users = [];
var holding = [];
var sunsets = {};
var invites = {};
var baseUrl = '/sunset/';

function validId(id) {
    return Boolean(id.match(/[a-z0-9]+$/));
}

app.get(baseUrl, function (req,res) {
    res.sendFile(__dirname+'/index.html');
});

// generate invite code, remove from avail users, hold tight
app.get(`${baseUrl}invite`, function (req, res) {
    if(!validId(req.query.user)) return res.send('uh uh uh!');

    var invite = _.uniqueId('invite');
    invites[invite] = req.query.user;
    var idx = _.findIndex(users, (u) => u.user == req.query.user);
    holding.push(users[idx]);
    _.pullAt(users, idx);
    res.send(invite);
});

io.on('connect', function (sock) {

    sock.on('tick', function (data){
        var peer = sock.peer;
        io.to(peer.id).emit('tick', {step: data.step, epoch: data.epoch});
    });

    sock.on('enter', function (data) {
	if(!validId(data.user)) return;

        if(users.length > 0){
            var peer = users.shift();

            var uid = _.uniqueId('sunset');
            sock.join(uid);
            sock.sunset = uid;
            sock.user = data.user;
            sock.peer = peer;

            // join peer to sunset room
            peer.join(uid);
            peer.sunset = uid;

            sunsets[uid] = [sock, peer];
            var sun_idx = _.uniqueId();

            console.log('connecting', sock.user, peer.user)
            io.to(peer.id).emit('update', {
                action: 'start',
                peer: sock.id,
                master: false,
                sun_idx: sun_idx,
            });

            io.to(sock.id).emit('update', {
                action: 'start',
                peer: peer.id,
                master: true,
                sun_idx: sun_idx,
            });

        } else {
            sock.user = data.user;
            users.push(sock);
        }
    });

    sock.on('subscribe', function (data){
	if(!validId(data.sunset) || !validId(data.user)) return;

        var peer = _.find(holding, (u) => u.user == invites[data.sunset]);
        var uid = _.uniqueId('sunset');
        var sun_idx = _.uniqueId();

        sock.join(uid);
        sock.sunset = uid;
        sock.user = data.user;
        sock.peer = peer;

        // join peer to sunset room
        peer.join(uid);
        peer.sunset = uid;

        console.log('connecting', sock.user, peer.user)
        io.to(peer.id).emit('update', {
            action: 'start',
            peer: sock.id,
            master: false,
            sun_idx: sun_idx,
        });

        io.to(sock.id).emit('update', {
            action: 'start',
            peer: peer.id,
            master: true,
            sun_idx: sun_idx,
        });
    });

    sock.on('disconnect', function(){
        console.log('removing user', sock.user);
        io.to(sock.sunset).emit('update', {action: 'exit'});
        _.remove(users, (u) => u.user == sock.user);
    });
});