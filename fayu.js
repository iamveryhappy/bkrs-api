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

const insCI = (ci) => {
  return new Promise( (resolve, reject) => {
    pool.query(sqls.copy_ci_inst, [ci], (err, rez) => {
      if ( err ) { reject(err); }
      resolve( rez );
    });
  });
};

const insZI = (hi) => { // select hi and insert into fayu
  return new Promise( (resolve, reject) => {
    pool.query(sqls.copy_zi_ins, [hi], (err, rez) => {
      if (err) { reject(err); }
      resolve( rez );
    });
  });
};

const text2lid = (tuples) => { // bind zi LID with current chapter ID
  return new Promise( (resolve, reject) => {
    pool.query(sqls.i_zct, tuples, (err, rez) => {
      if (err) { reject(err); }
      resolve( rez );
    });
  });
};

module.exports = (app) => {

  // IMPORTANT!!! TEXTid ISN'T CHAPTER ID!!!!!!!!!!!!!!!!!!!!!!!!!!!
  app.post('/fa/save', jsonParser, (req, res) => {
    console.log('faSAVE:', req.body);
    let results = {};

    if ( req.body.ci > 0 ){ // save words
      for (let i of req.body.ci){
        console.log('cI: ', i);
        insCI(i)
        .then( r => {
          if(r.insertId > 0){
            const ci2txt = [req.body.chapter, 0, r.insertId];
            text2lid(zi2txt)
            .then( l => {
              console.log('ciR--: ', r.insertId);
              console.log('ciL--: ', l.insertId);
            })
            .catch( ee => console.log('ciEERR: ', ee));
          }
        })
        .catch( e => console.log('ciERR: ', e));
      }
    }

    if ( req.body.zi > 0 ) { // save chars
      for (let i of req.body.zi){
        console.log('hI: ', i);
        insZI(i)
        .then( r => {
          console.log('R: ', r.insertId);
          if (r.insertId > 0) {
            const zi2txt = [req.body.chapter, r.insertId, 0];
            text2lid(zi2txt)
            .then( l => {
              console.log('R--: ', r.insertId);
              console.log('L--: ', l.insertId);
            })
            .catch( ee => console.log('ziEERR: ', ee));
          }
        })
        .catch( e => console.log('ziERR: ', e));
      }
    }

    console.log('results: ', results);
    res.status(200).json({rhi: null, error: null});

  });

  app.get('/fa/getLastChapter', (req, res) => {
    pool.query(sqls.s_lastChapter, (err, rez) => {
      if (err) {
        throw err;
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
