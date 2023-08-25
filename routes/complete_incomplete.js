var express = require('express');
var router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
var db = require('../db/db_connect');

router.post("/", urlencodedParser, async function (req, res, next) {
    var task_id = req.body.taskID;
    var task_id1 = req.body.taskID1;
    var id = req.cookies.userID;

    var currentDate = new Date(); // Получаем текущую дату и время

    // Преобразуем текущую дату в строку в нужном формате
    var dateString = currentDate.toLocaleDateString(); // Формат: "MM/DD/YYYY"
    var timeString = currentDate.toLocaleTimeString(); // Формат: "HH:MM:SS"
    
    // Объединяем дату и время
    var currentDateTimeString = dateString + ' ' + timeString;
    var sqlComplete = `UPDATE public."tblPlan" SET date_end = '${currentDateTimeString}' WHERE plan_fkusr = ${id} and ins_id=${task_id}`;
    var sqlInComplete = `UPDATE public."tblPlan" SET date_end = null WHERE plan_fkusr = ${id} and ins_id=${task_id1}`;
        if (task_id1 ==  undefined) {
            db.query(sqlComplete, (err, res)=>{
                if(err) throw err;
                console.log('Задача завершена');
            });
        } else {
            db.query(sqlInComplete, (err, res)=>{
                if(err) throw err;
                console.log('Задача воскресла');
        })}});

module.exports = router;