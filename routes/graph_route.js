var express = require('express');
var router = express.Router();
var db = require('../db/db_connect');
const urlencodedParser = express.urlencoded({extended: false});

router.post("/", urlencodedParser, async function(req, res, next) {
    var id = req.cookies.userID;
    var day1 = req.body.full_date;
    
    var day2 = new Date(day1);
    
    const allTasks = [];
    const completedTasks = [];
    const day_who = [];
    const task_event = [];
    
    for (let i = 0; i < 7; i++) {
        var currentDate = new Date(day1);
        currentDate.setDate(day2.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        var sql2 = `SELECT pln_title, date_start, date_end, ins_id FROM public."tblPlan" where plan_fkusr = ${id} and  pln_type='Встреча' 
        AND DATE_TRUNC('day', date_end) = DATE_TRUNC('day', '${dateString}'::timestamp)`;
        var taskevent = await db.query(sql2);
        task_event.push(taskevent.rows)

        var sql = `
    SELECT
        DATE_TRUNC('day', '${dateString}'::timestamp) AS day,
        COUNT(pln_title) AS count_all,
        SUM(CASE WHEN DATE_TRUNC('day', date_end) = DATE_TRUNC('day', '${dateString}'::timestamp) THEN 1 ELSE 0 END) AS count_end
    FROM public."tblPlan"
    WHERE plan_fkusr = ${id} AND pln_type != 'Встреча' AND DATE_TRUNC('day', date_start) <= DATE_TRUNC('day', '${dateString}'::timestamp)
        AND (DATE_TRUNC('day', date_end) >= DATE_TRUNC('day', '${dateString}'::timestamp) OR date_end IS NULL)
    GROUP BY day
    ORDER BY day;
`;

        var counttask = await db.query(sql);
        if (counttask.rows.length > 0) {
            allTasks.push(counttask.rows[0].count_all);
            completedTasks.push(counttask.rows[0].count_end);
            var days = currentDate.getDay() - 1;
            if (days === -1) {
                day_who.push(6);
            } else {
                day_who.push(days);
            }
        } else {
            allTasks.push(0);
            completedTasks.push(0);
            day_who.push(currentDate.getDay() - 1 === -1 ? 6 : currentDate.getDay() - 1);
        }

        if (i === 6) {
            const data = {
                allTasks: allTasks,
                completedTasks: completedTasks,
                day_who: day_who,
                task_event: task_event
            };
            res.json(data);
        }
    }
});


module.exports = router;
