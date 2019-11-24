// fayu: save to DB and print PDF
// const Rx = require('rxjs');
const { Observable } = require('rxjs');
const { tap, map, take } = require('rxjs/operators');
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

// call Observable constructor pass it a subscriber function as argument
new Observable(mysqlQ);
// should return an Observable
function mysqlQ (pool, sqls, values) {
  return Observable.create( observer => {
    pool.query(sqls, values, (err, rez, fields) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next({rez:rez, fields:fields});
      }
      observer.complete();
    });
  });
};

const getCID = () => {
  return new Promise( (resolve, reject) => {
    pool.query(sqls.s_lastChapter, (err, rez) => {
      if (err) { reject( err ) }
      // console.log('getCID-rez: ', rez);
      resolve( rez );
    });
  });
};

const insHI = (hi) => { // select hi and insert into fayu
  return new Promise( (resolve, reject) => {
    pool.query(sqls.copy_hi_ins, [hi], (err, rez) => {
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

  app.post('/fa/save', jsonParser, (req, res) => {
    console.log('faSAVE:', req.body);
    let results = {};
    for (let i of req.body.zi){
      console.log('I: ', i);
      insHI(i)
      .then( r => {
        console.log('R: ', r.insertId);
        if (r.insertId > 0) {
          const zi2txt = [r.insertId, req.body.chapter, 0];
          text2lid(zi2txt)
          .then( l => {
            console.log('R--: ', r.insertId);
            console.log('L--: ', l.insertId);
          })
          .catch( ee => console.log('EERR: ', ee));
        }
        // console.log('R: ', r);
      })
      .catch( e => console.log('ERR: ', e));

    }
console.log('results: ', results);
    res.status(200).json({rhi: null, error: null});

  });
    app.get('/fa/getLastChapter', (req, res) => {
      // console.log('getLastChapter-GET');
      mysqlQ(pool, sqls.s_lastChapter, [])
      .pipe(
       take(1),
       tap( rez => console.log('REZ: ', rez)),
       map( rez => JSON.parse(JSON.stringify(rez)).rez[0] )
      )
      .subscribe(
       (rez) => {
         // console.log('s-REZ: ', rez)
         res.status(200).json({chapter_name: rez['c_chapter'], chapter_id: rez['c_id'], error: null});
      },
       (error) => {
         console.log('s-ERR: ', error)
         res.status(200).json({ chapter_name: null, chapter_id: null, error: error})
      },
       () => {console.log('getLastChapter completed!!!')}
      )

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
