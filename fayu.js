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

  app.get('/fa/getLastChapter', (req, res) => {
    pool.query(sqls.s_lastChapter, (err, rez) => {
      if (err) {
        res.status(200).json({chapter_name: null, chapter_id: null, error: err})
      } else if( typeof( rez ) !== 'undefined' && rez.length >= 1 && rez[0]['c_chapter'] ) {
        res.status(200).json({chapter_name: rez[0]['c_chapter'], chapter_id: rez[0]['c_id'], error: null})
      } else {
        res.status(200).json({chapter_name: null, chapter_id: null, error: 'unknown error'})
      }
    });
  });

//   sqls.s_chap = 'SELECT c_id, c_chapter FROM fayu.c_chapters WHERE c_id=?';
  app.post('/fa/chapter', jsonParser, (req, res) => {
    pool.query( sqls.s_chap, [req.body.chap], (err, rez) => {
      if (err) {
        res.status(200).json({chapter_name: null, chapter_id: req.body.chap, error: err})
      } else if( typeof( rez ) !== 'undefined' && rez.length >= 1 && rez[0]['c_chapter'] ) {
        res.status(200).json({chapter_name: rez[0]['c_chapter'], chapter_id: req.body.chap, error: null})
      } else {
        res.status(200).json({chapter_name: null, chapter_id: req.body.chap, error: null})
      }
    }
    );
  });
};

// '/fa/save'
// zici_texts -> return texts.t_id
//
// ->{
//   ci: [],
//   zi: []
// } -> save to fayu_hi, fayu_word ->faw_id + fa_id
// for ([faw_id, fa_id] -- t_id) -> zici_texts