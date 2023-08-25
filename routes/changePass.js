var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var db = require('../db/db_connect');

const urlencodedParser = express.urlencoded({extended: false});


router.post("/", urlencodedParser, async function (req, res) {
    const usrID = req.body.usrID;
    const token = req.body.token;
    var psw1 = req.body.NewPassword;
    var psw2 = req.body.ConfirmNewPassword;
    console.log(usrID, token, psw1, psw2)

    try{
        if (psw1==psw2) {
            console.log(usrID);
            hashPassword(psw1, usrID, token);
            res.redirect('/');
    
        }else{
            console.log("-- Пароли не совпали!");
            res.render('permPass');
        }

    } catch (error) {
        res.render('error', { title: 'Error', message: 'Error sending new password', error: error });
    }
});

function hashPassword(psw, id, token) {
    if (!id){
        bcrypt.genSalt(10, function(err, salt) {
        if (err) throw err;
        bcrypt.hash(psw, salt, function(err, hash) {
            if(err) throw err;
            updatePSW(hash, id, token);
        })
    })
    } else {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) throw err;
            bcrypt.hash(psw, salt, function(err, hash) {
                if(err) throw err;
                updatePSW(hash, id, token);
            })
        })
    }
    
 }

async function updatePSW(genpsw, id, token) {
    const sql_id = `UPDATE public."tblUsr" SET usr_psw = $1  WHERE usr_id=$2`;
    const sql_token = `UPDATE public."tblUsr" SET usr_psw = $1  WHERE reset_token=$2`;
    if(!id) {
      try {
        await db.query(sql_token, [genpsw, token]); // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }  
    } else {
        try {
            await db.query(sql_id, [genpsw, parseInt(id)]); // sends queries
            return true;
        } catch (error) {
            console.error(error.stack);
            return false;
        } 
    }
    
 }

 module.exports = router;