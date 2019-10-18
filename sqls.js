// sql queries
const sqls = {};

sqls.s_lastChapter = 'SELECT MAX(c_id) AS `c_id`, c_chapter FROM fayu.chapters';
sqls.s_chap = 'SELECT c_id, c_chapter FROM fayu.chapters WHERE c_id=?';


// fayu-START: faw_id, bw_id, bw_bh_id, bw_has_tr, bw_length, bw_sm, bw_tr, bw_pin, bw_trans
sqls.i_faw = 'INSERT INTO fayu_word(bw_id, bw_bh_id, bw_has_tr, bw_length, bw_sm, bw_tr, bw_pin, bw_trans) VALUES(?,?,?,?,?,?,?,?)';
sqls.s_faw = 'SELECT bw_id, bw_bh_id, bw_has_tr, bw_length, bw_sm, bw_tr, bw_pin, bw_trans FROM fayu_word WHERE faw_id=?';

sqls.i_fa = 'INSERT INTO fayu_hi(bh_id, bh_has_tr, bh_hex, bh_sm, bh_tr, bh_pin, bh_trans) VALUES(?,?,?,?,?,?,?)';
sqls.s_fa = 'SELECT bh_id, bh_has_tr, bh_hex, bh_sm, bh_tr, bh_pin, bh_trans FROM fayu_hi WHERE fa_id=?';

sqls.i_zct = 'INSERT INTO zici_texts(zct_t_id, zct_bh_id, zct_bw_id) VALUES(?,?,?)';
sqls.s_zct = 'SELECT (zct_id, zct_t_id, zct_bh_id, zct_bw_id) FROM zici_texts WHERE zct_t_id=?';
sqls.d_zct = 'DELETE FROM zice_texts WHERE zct_t_id=?';

sqls.i_text = 'INSERT INTO texts(t_chapter, t_raw, t_mark) VALUES(?,?,?)';
sqls.s_text = 'SELECT t_chapter, t_raw, t_mark FROM texts WHERE t_id=?';
sqls.d_text = 'DELETE FROM texts WHERE t_id=?';

// fayu-END

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
