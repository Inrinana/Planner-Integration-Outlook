var express = require('express');
var router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
var db = require('../db/db_connect');

router.post("/", urlencodedParser, async function (req, res, next) {
    var edit_task = req.body.editInput;
    var task_id = req.body.taskID;
    var date = req.body.date;
    var id = req.cookies.userID;

    var currentDate = new Date(); // Получаем текущую дату и время

    // Преобразуем текущую дату в строку в нужном формате
    var dateString = currentDate.toLocaleDateString(); // Формат: "MM/DD/YYYY"
    var timeString = currentDate.toLocaleTimeString(); // Формат: "HH:MM:SS"
    
    // Объединяем дату и время
    var currentDateTimeString = dateString + ' ' + timeString;
    var sql = `UPDATE public."tblPlan" SET pln_title='${edit_task}', date_start = '${currentDateTimeString}', date_end ='${date}' WHERE plan_fkusr = ${id} and ins_id=${task_id}`;
    var sqlUpdate = `UPDATE public."tblPlan" SET pln_title='${edit_task}', date_start = '${currentDateTimeString}' WHERE plan_fkusr = ${id} and ins_id=${task_id}`;
    if (edit_task != null && edit_task.length != 0) {
        if (date ==  undefined) {
            db.query(sqlUpdate, (err, res)=>{
                if(err) throw err;
                console.log('Успешно изменены данные в бд ');
            });
        } else {
            db.query(sql, (err, res)=>{
                if(err) throw err;
                console.log('Успешно изменены данные в бд c датой');
            });
    }} else {
        console.log('task undefined');
    }});
    

module.exports = router;