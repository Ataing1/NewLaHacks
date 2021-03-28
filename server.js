const express = require('express');
const app = express();
const { resolve } = require('path');

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

let port = process.env.PORT || 1111;
if (port === 1111) {
	app.listen(port, () => console.log('running on http://localhost:' + port));
} else {
	app.listen(port, () => console.log('Live using port: ' + port));
}