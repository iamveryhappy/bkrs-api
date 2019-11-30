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

async function insTXT (rq) {

  const results = {
    textID: null,
    chapterID: rq.body.chapter,
    ci: [],
    zi: []
  };

  const txt = [rq.body.chapter, rq.body.raw, rq.body.markup];

  // save txt to DB
  results.textID = await new Promise( (resolve, reject) => {
    pool.query(sqls.i_text, txt, (err, rez) => {
      if ( err ) { reject(err); }
      resolve( rez.insertId );
    });
  });

  console.log('fRID: ', results.textID);

  for ( let ci of rq.body.ci ) {
    console.log('cI: ', ci);
    let ciLID = await new Promise( (resolve, reject) => {
      pool.query(sqls.copy_ci_inst, [ci], (err, rez) => {
        if ( err ) { reject(err); }
        resolve( rez.insertId );
      });
    });
    results.ci.push(ciLID);
  }

  for ( let zi of rq.body.zi ) {
    console.log( 'zI: ', zi);
    let ziLID = await new Promise( (resolve, reject) => {
      pool.query(sqls.copy_zi_ins, [zi], (err, rez) => {
        if ( err ) { reject(err); }
        resolve( rez.insertId );
      });
    });
    results.zi.push(ziLID);
  }

  console.log('f-results: ', results);

  return results;
};


module.exports = (app) => {

  app.post('/fa/save', jsonParser, (req, res) => {
    console.log('faSAVE:', req.body);
    insTXT( req )
    .then( rez => {
      console.log('faSAVE-results-rez: ', rez);
      res.status(200).json({results: rez, error: null});
    })
    .catch( e => {
      console.log(e);
      res.status(200).json({results: null, error: e});
    });
  });
  // IMPORTANT!!! TEXTid ISN'T CHAPTER ID!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
