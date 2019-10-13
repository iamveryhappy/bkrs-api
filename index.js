// index
'use strict';
const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

app.use(cors());

// app.use(cors({
// 	origin: ['*'],
// 	methods: ['GET', 'POST'],
// 	allowedHeaders: ['Access-Control-Allow-Methods', 'Access-Control-Allow-Origin', 'Content-Type']
// }));

require("./api")(app);
require("./fayu")(app);

app.listen(port, () => {
	console.info( `Server is up & running on port ${port} @ localhost` );
});


// console.log('here we are...');