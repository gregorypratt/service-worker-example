var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/messages', function (req, res) {
	res.status(200).send(['Hello there', 'this is another message, yay.']);
});

app.post('/message', function (req, res) {
	if (!req.body || !req.body.msg) return res.sendStatus(400);
	io.emit('chat message', req.body.msg);
	res.sendStatus(200);
});

app.post('/messages', function (req, res) {
	if (!req.body || !Array.isArray(req.body)) return res.sendStatus(400);
	req.body.forEach(function (item) {
		io.emit('chat message', item.msg);
	});
	res.sendStatus(200);
});


http.listen(3000, function () {
	console.log('Let\'s go');
});