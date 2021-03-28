const express = require('express');
const app = express();
const { resolve } = require('path');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

if (process.env.NODE_ENV === 'development') {
	console.log("THIS IS DEVELOPMENT MODE");
	require('dotenv').config({ path: './.env' });
} else {
	console.log("THIS IS PRODUCTION MODE");
	console.log(process.env);
}

app.use(express.static(process.env.STATIC_DIR));

app.get('/', (req, res) => {
	const path = resolve(process.env.STATIC_DIR + '/index.html');
	res.sendFile(path);
});

app.get('/new-room', (req, res) => {
	res.redirect(`/${uuidV4()}`)
})


app.get('/:room', (req, res) => {
	res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected', userId)

		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId)
		})
	})
})


let port = process.env.PORT || 1111;
if (port === 1111) {
	app.listen(port, () => console.log('running on http://localhost:' + port));
} else {
	app.listen(port, () => console.log('Live using port: ' + port));
}