// sql queries
const sqls = {};

// traditional to simplified batch lookup
sqls.ht2s = 'SELECT bh_tr, bh_sm FROM mova.bkrs_hi WHERE bh_tr IN (?) OR bh_sm IN (?)';
sqls.wt2s = 'SELECT bw_id, bw_sm, bw_tr FROM mova.bkrs_word WHERE bw_tr IN (?) OR bw_sm IN (?)';

sqls.smtr = 'SELECT bw_id, bw_sm, bw_tr, bw_pin, bw_trans FROM mova.bkrs_word WHERE bw_tr IN (?) OR bw_sm IN (?)';
sqls.hitr = 'SELECT bh_id, bh_sm, bh_tr, bh_pin, bh_trans FROM mova.bkrs_hi WHERE bh_tr IN (?) OR bh_sm IN (?)';

// ops for stop list
sqls.stop = 'SELECT bkrs_sm, bkrs_tr FROM mova.bkrs_sl WHERE bkrs_sm IN(?) OR  bkrs_tr IN(?)';
sqls.one4stop = 'SELECT bh_sm, bh_tr FROM mova.bkrs_hi WHERE bh_sm=? OR bh_tr=?';
sqls.many4stop = 'SELECT bw_sm, bw_tr FROM mova.bkrs_word WHERE bw_sm=? OR bw_tr=?'
sqls.add2stop = 'INSERT INTO bkrs_sl(bkrs_tr, bkrs_sm) VALUES(?,?)';

// check against stop list
sqls.chk = 'SELECT sl_id FROM mova.bkrs_sl WHERE bkrs_sm = ? OR bkrs_tr = ?';

module.exports = sqls;

// '第九',
// '第九节',
// '第九节复',
// '第九节复合',
// '第九节复合句',
// '九节',
// '九节复',
// '九节复合',
// '九节复合句',
// '节复',
// '节复合',
// '节复合句',
// '复合',
// '复合句',
// '合句'

// select bw_sm, bw_tr, bw_tr, bw_pin, bw_trans from mova.bkrs_word
// where bw_sm IN (
//
//   '第九',
//   '第九节',
//   '第九节复',
//   '第九节复合',
//   '第九节复合句',
//   '九节',
//   '九节复',
//   '九节复合',
//   '九节复合句',
//   '节复',
//   '节复合',
//   '节复合句',
//   '复合',
//   '复合句',
//   '合句'
//
// );
