var express = require('express');
var router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
var db = require('../db/db_connect');
const { route } = require('./authorize');
const bcrypt = require('bcrypt');



router.post("/", urlencodedParser, async function (req, data, next) {
    let parms = { title: 'Inbox', active: { inbox: true } };
    const email = await req.body.logname;
    var psw = await req.body.logpsw;
  
    var sql = `select usr_id, usr_email, usr_psw from public."tblUsr" where usr_email='${email}'`;
    db.query(sql, (err, res)=>{
        console.log("Вход в квери");
        try{
            console.log("Первый трай");
            if(!err && res.rows[0]["usr_email"]==email) { // если логины совпали, то сравниваем пароли
                console.log('First IF   ', res.rows[0]["usr_email"])
                console.log("-- Логины совпали!");
    
                if(res.rows[0]["usr_psw"].indexOf('$2b$10$') != 0) { // если в пароле не содержится посторока соли, то пароль одноразовый
                    console.log('Third IF   ', res.rows[0]["usr_psw"])
    
                    if(res.rows[0]["usr_psw"] == psw){ // если пароль совпали, то переход на страницу смены пароля
                        console.log('4 IF   ', res.rows[0]["usr_psw"]);
                        var usrID = res.rows[0]["usr_id"];
                        data.render('permPass', {usrID: usrID });
                    } else {
                        console.log('Одноразовые пароли не совпали');
                        data.clearCookie('userID', { maxAge: 28800000, httpOnly: true });
                        parms.mess = 'Неверный временный пароль'
                        data.render('index',parms);
                    }                
    
                } else { // если пароль содержит соль, то мы сравниваем хэши

                    bcrypt.compare(psw, res.rows[0]["usr_psw"])
                    .then ((result) => {
                        if (result) {
                            console.log('-- func Пароли совпадают')
                            var usrID = res.rows[0]["usr_id"];
                            data.cookie('userID', usrID, { httpOnly: true });
                            data.redirect('/mail')


                } else {
                            console.log('-- func Пароли не совпадают')
                            data.clearCookie('userID', { maxAge: 28800000, httpOnly: true });
                            parms.mess = 'Неверный пароль'
                            data.render('index',parms);
                        }
                    })
                    .catch ((error) => {
                        console.log(error)
                    })
                    
                }
    
            } else {
                console.log("-- Логины не совпадают");
                data.redirect('/');
            }
        } catch {
            console.log("или мы тут");
            data.redirect('/');
        }

        
    })

  });


module.exports = router;
