// API
const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit : 10,
	host            : 'localhost',
	user            : 'root',
	password        : 'abcde',
	database        : 'mova'
});


const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const sqls = require('./sqls');
let stopList = true; // from Client in json whether stop list is ON/OFF

 const oneToStopList = (pair) => { // IMPORTANT: addtion to stop list w/o simplified lookup
  return new Promise( (resolve, reject) => {
    pool.query(sqls.add2stop, [pair,pair], (err, res) => {
      if (err) { reject(err) }
      resolve(res);
    });
  });
 };

  const trad2simp = (tr) => {
    let trads = tr.split('');
    return new Promise( (resolve, reject) => {
      pool.query(sqls.ht2s, [trads, trads], (err, res) => {
        if (err) { reject(err) }
        resolve(res);
      });

    });
  };

  const manyTrans = (arr) => {
    return new Promise( (resolve, reject) => {
      pool.query(sqls.smtr, [arr, arr], (err, res) => {
        if (err) { reject(err) }
        resolve(res);
      });

    });
  };

  const oneTrans = (arr) => {
    return new Promise( (resolve, reject) => {
      pool.query(sqls.hitr, [arr, arr], (err, res) => {
        if (err) { reject(err) }
        let rez = [];
        if ( typeof res !== 'undefined' ){
          for( let one of JSON.parse(JSON.stringify(res)) ){
            one['bh_trans'] = one['bh_trans'].split(';').slice(0,9).join(';');
            rez.push(one);
          }          
        }
        resolve(rez);
      });

    });
  };

  const stopListOne = (ones) => {
    return new Promise( (resolve, reject) => {
      pool.query(sqls.stop, [ones, ones], (err, res) => {
        if (err) { reject(err) }
        resolve(res);
      });
    });
  };

  const stopListMany = (many) => {
    return new Promise( (resolve, reject) => {
      pool.query(sqls.stop, [many, many], (err, res) => {
        if (err) { reject(err) }
        resolve(res);
      });
    });
  };

  async function getTranslation (stopList, ones, manys){

    const oneStopList = await stopListOne(ones);
    let oneList = [], oneChkd = [], manyChkd = [], oneTranList = [], manyTranList = [];
    for (let one of JSON.parse(JSON.stringify(oneStopList)) ){
      oneList.push({'tr':one.bkrs_tr, sm:one.bkrs_sm});
    }
    // console.log('oneList: ', oneList);

    const manyStopList = await stopListMany(manys);
    let manyList = [];
    for (let one of JSON.parse(JSON.stringify(manyStopList)) ){
      manyList.push({'tr':one.bkrs_tr, sm:one.bkrs_sm});
    }
    // console.log('manyList: ', manyList);
    // console.log('stopList: ', stopList);

    for (let o of ones ){ // check against our stoplist (hieroglyphs)
      if( stopList ){
        let inStop = false;
        for( let os of oneList ){
          if ( o === os.tr || o === os.sm ){
            inStop = true;
          }
        }
        if( !inStop ) {
          oneChkd.push(o);
        }
      } else {
        oneChkd.push(o);
      }
    }

    for (let m of manys ){ // check against our stoplist (words)
      if( stopList ){
        let inStop = false;
        for( let os of manyList ){
          if ( m === os.tr || m === os.sm ){
            inStop = true;
          }
        }
        if( !inStop ) {
          manyChkd.push(m);
        }
      } else {
        manyChkd.push(m);
      }
    }

    // get translations for valid words and single characters
    if ( oneChkd.length ){
      oneTranList = await oneTrans(oneChkd);
    }
    if ( manyChkd.length ){
      manyTranList = await manyTrans(manyChkd);
    }
    // const oneTranList = await oneTrans(oneChkd);
    // const manyTranList = await manyTrans(manyChkd);

    return {
        // one: oneList,
        // many: manyList,
        oneChkd: oneChkd,
        ones: ones,
        manys: manys,
        manyChkd: manyChkd,
        oneTranList: JSON.parse(JSON.stringify(oneTranList)),
        manyTranList: JSON.parse(JSON.stringify(manyTranList))
    };

  }

module.exports = (app) => {
  app.post('/api/chkstop', jsonParser, (req, res) => {
    pool.query(sqls.chk, [req.body.tochk, req.body.tochk], (err, rez) => {

      if(err){
        res.status(200).json({OK: false, error: err});
      }
      if ( rez.length ){
        res.status(200).json( { OK: true, tochk: rez[0]['sl_id'] } );
      } else {
        res.status(200).json({OK: false, tochk: rez});
      }

    });
  });
  
  app.post('/api/2stop', jsonParser, (req, res) => { // console.log( 'req.body: ', req.body.to)
    pool.query(sqls.add2stop, [req.body.to.tr, req.body.to.sm], (err, rez) => {
      if (err){
        res.status(200).json({OK: false, error: err});
      } else {
        res.status(200).json({OK: true, added: rez});
      }
    });
  });
//   {
  //     "toStop":["第九", "第九"] sqls.add2stop = 'INSERT INTO bkrs_sl(bkrs_tr, bkrs_sm) VALUES(?)';
//   }
  app.post('/api/add2stop', jsonParser, (req, res) => {
    console.log('add2stop: ', req.body);
    oneToStopList(req.body.toStop)
    .then( (rez) => {
      res.status(200).json({OK: true, added: rez});
    })
    .catch( (e) => {
      res.status(200).json({OK: false, error: e});
    });

  });

/* app.post('/api/trans' ==>
  {
    "sstr":"次繫敍述一種要求直接的語言裡",
      "stopList":false
  }
*/
  app.post('/api/trans', jsonParser, (req, res) => {
    // console.log('TRANS: ', req.body);
    let outer = [], inner = [], one = [], many = [];
    outer = req.body.sstr.split(''); // ANY (sm/tr) string
    stopList = req.body.stopList; // true/false == ON/OFF
    inner = outer;
    for(let o = 0; o < outer.length; o++){
      for (let i = 1; i <= inner.length; i++){
        let cur = outer;
        let pick = cur.slice(o,i);
        if ( pick.length === 1 ) {
          one.push(pick.join(''));
        }
        if ( pick.length > 1 ) {
          many.push(pick.join(''));
        }
      }
    }
    getTranslation(stopList, one, many)
    .then( (robj) => {
      res
          .status(200)
          .json({
                OK: true,
                manyTranList: robj.manyTranList,
                oneTranList: robj.oneTranList
           });
      // res.status(200).json({OK: true, many: robj.many, one: robj.one, ones: robj.ones, oneChkd: robj.oneChkd, manyChkd: robj.manyChkd, manyTranList: robj.manyTranList, oneTranList: robj.oneTranList});
    })
    .catch( (e) => { res.status(200).json({OK: false, error: e}); });

  });

  app.post('/api/smtr', jsonParser, (req, res) => { // splitter & translation
    console.log('SMTR: ', req.body); // should be already simplified
    let outer = [], inner = [], one = [], many = [];
    outer = req.body.sstr.split(''); // simplified string
    inner = outer;
    for(let o = 0; o < outer.length; o++){
      for (let i = 1; i <= inner.length; i++){
        let cur = outer;
        let pick = cur.slice(o,i);
        if ( pick.length === 1 ) {
          one.push(pick);
        }
        if ( pick.length > 1 ) {
          many.push(pick.join(''));
        }
      }
    }
    manyTrans(many)
    .then( (mani) => {
      oneTrans(one)
      .then( (ones) => {
        res.status(200).json({OK: true, many: many, mani: mani, one: one, ones: ones});
      })
      .catch( (e) => {
        res.status(200).json({OK: false, error: e});
      });
    })
    .catch( (e) => {
      res.status(200).json({OK: false, error: e});
    });

  });

  // OK
  app.get('/api/ok', (req, res) => {
    res.status(200).json({"OK": true})
  });

	// catch for all URL
	app.all("/api/*", function(req, res) {
		res.status(404).json({ NotFoundUrlOrPath: req.url, andItsMethod:req.method });
	});

};
