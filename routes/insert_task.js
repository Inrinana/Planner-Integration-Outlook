var express = require('express');
var router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
var db = require('../db/db_connect');

router.post("/", urlencodedParser, async function (req, res, next) {
    var task = req.body.taskname;
    var task_id = req.body.taskID
    console.log('this task', task)
    var taskType = req.body.tasktype; // Здесь будет значение "личное", "рабочее" или "другое"
    var taskTime = req.body.tasktime;
    var id = req.cookies.userID;
    var currentDate = new Date(); // Получаем текущую дату и время

    // Преобразуем текущую дату в строку в нужном формате
    var dateString = currentDate.toLocaleDateString(); // Формат: "MM/DD/YYYY"
    var timeString = currentDate.toLocaleTimeString(); // Формат: "HH:MM:SS"
    
    // Объединяем дату и время
    var currentDateTimeString = dateString + ' ' + timeString;

    var sql_task = `INSERT INTO public."tblPlan" (pln_title, date_start, date_end, plan_fkusr, ins_id, pln_type)
        VALUES ('${task}', '${currentDateTimeString}', null, ${id}, ${task_id}, '${taskType}' );`;
    var sql_meeting = `INSERT INTO public."tblPlan" (pln_title, date_start, date_end, plan_fkusr, ins_id, pln_type)
    VALUES ('${task}', '${currentDateTimeString}', '${taskTime}', ${id}, ${task_id}, '${taskType}' );`;
    if (task != null && task.length != 0 && task != undefined) {
        if (taskTime != null && taskTime != undefined && taskTime.length != 0) {
            db.query(sql_meeting, (err, res)=>{
                if(err) throw err;
                console.log('Успешно занесены данные в бд (встреча)');
        
              });
        } else {
            db.query(sql_task, (err, res)=>{
                if(err) throw err;
                console.log('Успешно занесены данные в бд');
        
              });
        }
        
    } else {
        console.log('task undefined');
    }
});

module.exports = router;