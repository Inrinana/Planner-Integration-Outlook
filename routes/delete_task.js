var express = require('express');
var router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
var db = require('../db/db_connect');


router.post("/", urlencodedParser, async function (req, data, next) {
    var task_id = req.body.taskID;
    var id = req.cookies.userID;
    var sql_sel = `select * FROM public."tblPlan";`;
    var sql = `DELETE FROM public."tblPlan" WHERE ins_id = $1 and plan_fkusr = $2;`;
    const delbase = await db.query(sql, [task_id, id]);
    //console.log(delbase);
    db.query(sql_sel, (err, res)=>{
      if(err) console.log(err);
      console.log('Удалены записи бд')
        });
});

module.exports = router;
