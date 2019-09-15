// index
'use strict';
const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

app.use(cors({
	origin: ['http://localhost'],
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type']
}));

require("./api")(app);

app.listen(port, () => {
	console.info( `Server is up & running on port ${port} @ localhost` );
});


console.log('here we are...');