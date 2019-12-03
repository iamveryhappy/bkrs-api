// fayu: save text and voca to DB

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

async function insTXT (rq) {

  const results = {
    textID: null,
    chapterID: rq.body.chapter,
    ci:  [],
    zi:  [],
    cit: [],
    zit: []
  };

  const txt = [rq.body.chapter, rq.body.raw, rq.body.markup];

  // save txt to DB
  results.textID = await new Promise( (resolve, reject) => {
    pool.query(sqls.i_text, txt, (err, rez) => {
      if ( err ) { reject(err); }
      resolve( rez.insertId );
    });
  });

//   console.log('fRID: ', results.textID);

  // find CI and save
  for ( let ci of rq.body.ci ) {
//     console.log('cI: ', ci);
    let ciLID = await new Promise( (resolve, reject) => {
      pool.query(sqls.copy_ci_inst, [ci], (err, rez) => {
        if ( err ) { reject(err); }
        resolve( rez.insertId );
      });
    });
    results.ci.push(ciLID);
  }

  // find ZI and save
  for ( let zi of rq.body.zi ) {
//     console.log( 'zI: ', zi);
    let ziLID = await new Promise( (resolve, reject) => {
      pool.query(sqls.copy_zi_ins, [zi], (err, rez) => {
        if ( err ) { reject(err); }
        resolve( rez.insertId );
      });
    });
    results.zi.push(ziLID);
  }

  // bind CI & ZI with the text(ID)
  // check: how mahy tied of ZI (zit)
  for ( let zID of results.zi ) { // zct_t_id, zct_bh_id, zct_bw_id
    let z2tLID = await new Promise( (resolve, reject) => {
      pool.query( sqls.i_zct, [results.textID, zID, undefined], (err, rez) => {
        if (err) { reject(err); }
        resolve( rez.insertId );
      });
    });
    results.zit.push(z2tLID);
  }
  // check: how mahy tied of CI (cit)
  for ( let cID of results.ci ) { // zct_t_id, zct_bh_id, zct_bw_id
    let c2tLID = await new Promise( (resolve, reject) => {
      pool.query( sqls.i_zct, [results.textID, undefined, cID], (err, rez) => {
        if (err) { reject(err); }
        resolve( rez.insertId );
      });
    });
    results.cit.push(c2tLID);
  }

//   console.log('f-results: ', results);

  return results;
};


module.exports = (app) => {

  app.post('/fa/save', jsonParser, (req, res) => {
//     console.log('faSAVE:', req.body);
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
