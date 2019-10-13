// fayu: save to DB and print PDF

const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit : 5,
	host            : 'localhost',
	user            : 'root',
	password        : 'abcde',
	database        : 'fayu'
});

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const sqls = require('./sqls');

module.exports = (app) => {
  app.post('/fa/save', jsonParser, (req, res) => {
    console.log('faSAVE:', req.body);
    res.status(200).json({"OK": true});
  });
};
